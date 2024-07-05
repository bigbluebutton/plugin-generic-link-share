import * as React from 'react';
import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  ActionButtonDropdownOption,
  ActionButtonDropdownSeparator,
  BbbPluginSdk,
  GenericContentMainArea,
  PluginApi,
  LayoutPresentatioAreaUiDataNames,
  UiLayouts,
  CurrentPresentation,
  RESET_DATA_CHANNEL,
  pluginLogger,
  PresentationToolbarButton,
} from 'bigbluebutton-html-plugin-sdk';

import GenericComponentLinkShare from '../generic-component/component';

import { DataToGenericLink, DecreaseVolumeOnSpeakProps } from './types';
import { ModalToShareLink } from '../modal-to-share-link/component';

const SEARCH_PATTERN = /link(\s*\{(.|\n|\r\n)*\})/g;

function GenericLinkShare(
  { pluginUuid: uuid }: DecreaseVolumeOnSpeakProps,
): React.ReactElement {
  BbbPluginSdk.initialize(uuid);
  const [showModal, setShowModal] = useState<boolean>(false);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const [showingPresentationContent, setShowingPresentationContent] = useState(false);
  const { data: currentUser } = pluginApi.useCurrentUser();
  const [link, setLink] = useState<string>(null);
  const { data: urlToGenericLink, pushEntry: pushEntryUrlToGenericLink, deleteEntry: deleteEntryUrlToGenericLink } = pluginApi.useDataChannel<DataToGenericLink>('urlToGenericLink');
  const currentPresentationResponse = pluginApi.useCurrentPresentation();
  const [linkError, setLinkError] = useState<string>(null);
  const [previousModalState, setPreviousModalState] = useState<DataToGenericLink>({
    isUrlSameForRole: true,
    url: null,
  });
  const [genericContentd, setGenericContentd] = useState<string>('');

  const currentLayout = pluginApi.useUiData(LayoutPresentatioAreaUiDataNames.CURRENT_ELEMENT, [{
    isOpen: true,
    currentElement: UiLayouts.WHITEBOARD,
  }]);

  useEffect(() => {
    const isGenericComponentInPile = currentLayout.some((gc) => (
      gc.currentElement === UiLayouts.GENERIC_CONTENT
      && gc.genericContentId === genericContentd
    ));
    if (isGenericComponentInPile) {
      setShowingPresentationContent(true);
    } else setShowingPresentationContent(false);
  }, [currentLayout]);

  const handleCheckboxChange = () => {
    setPreviousModalState((p) => ({
      isUrlSameForRole: !p.isUrlSameForRole,
      url: p.url,
      viewerUrl: p.viewerUrl,
    }));
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setLinkError(null);
  };

  const handleChangePresentationAreaContent = (changeToShare: boolean) => {
    if (!changeToShare) {
      setShowingPresentationContent(false);
    } else {
      setShowingPresentationContent(true);
    }
  };

  const requestCurrentPage = (currentTxtUri: string) => fetch(currentTxtUri)
    .then((response) => response.text());

  const addButtonToPresentationToolbar = (title: string, presenter: string, viewer?: string) => {
    if (currentUser?.presenter) {
      const currentObjectToSendToClient = new PresentationToolbarButton({
        label: `Play ${title}`,
        tooltip: 'A generic link tag has been detected in this slide, show it to all?',
        onClick: () => {
          deleteEntryUrlToGenericLink([RESET_DATA_CHANNEL]);
          pushEntryUrlToGenericLink({
            url: presenter && viewer,
            isUrlSameForRole: !presenter,
            viewerUrl: viewer,
          });
        },
      });
      pluginApi.setPresentationToolbarItems([currentObjectToSendToClient]);
    }
  };

  const handleFetchPresentationData = (
    currentPres: CurrentPresentation,
  ) => {
    pluginApi.setPresentationToolbarItems([]);
    const currentTxtUri = currentPres?.currentPage?.urlsJson?.text;
    pluginLogger.info('Trying to fetch the slide text in the following URI:', currentTxtUri);
    if (currentTxtUri) {
      requestCurrentPage(currentTxtUri).then((currentPageContent) => {
        const match = SEARCH_PATTERN.exec(currentPageContent);
        if (match && match.length > 0) {
          pluginLogger.info('Link tag found! Parsing its fields...');
          const linkContent = match[0];
          const regexFields = /link\s*\{(?:[^{}]*\n)*?[^{}]*title:\s*“([^”]*)”(?:[^{}]*\n)*?(?:,\s*presenter:\s*“([^”]*)”(?:[^{}]*\n)*?)?(?:,\s*viewer:\s*“([^”]*)”(?:[^{}]*\n)*?)?[^{}]*\}/g;
          const fieldMatch = regexFields.exec(linkContent);
          if (fieldMatch) {
            pluginLogger.info('Fields successfully parsed!');
            const title = fieldMatch[1];
            const presenter = fieldMatch[2];
            const viewer = fieldMatch[3];
            addButtonToPresentationToolbar(title, presenter, viewer);
          }
        }
      }).catch((err) => {
        pluginLogger.error(`Error while requesting data from bbb-web. Could not get the base text, error: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const { data: currentPresentation } = currentPresentationResponse;
    if (currentUser?.presenter) handleFetchPresentationData(currentPresentation);
  }, [currentPresentationResponse, currentUser]);

  const handleSendLinkToIframe = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let objectToDispatch: DataToGenericLink;
    const regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g;
    if (previousModalState.isUrlSameForRole) {
      const target = e.target as typeof e.target & {
        link: { value: string };
      };
      if (target.link.value.match(regex)) {
        objectToDispatch = {
          isUrlSameForRole: true,
          url: target.link.value,
        };
      }
    } else {
      const target = e.target as typeof e.target & {
        link: { value: string };
        viewerLink: { value?: string };
      };
      if (target.link.value.match(regex)) {
        objectToDispatch = {
          isUrlSameForRole: false,
          url: target.link.value,
          viewerUrl: target.viewerLink.value,
        };
      }
    }
    if (objectToDispatch) {
      deleteEntryUrlToGenericLink([RESET_DATA_CHANNEL]);
      pushEntryUrlToGenericLink(objectToDispatch);
      setShowModal(false);
    } else {
      setLinkError('Link is malformed, please insert a valid one');
    }
  };

  useEffect(() => {
    if (
      urlToGenericLink.data
      && urlToGenericLink
        .data[urlToGenericLink.data.length - 1]?.payloadJson
    ) {
      setPreviousModalState(urlToGenericLink
        .data[
          urlToGenericLink.data.length - 1]?.payloadJson);
      const isUrlTheSame = urlToGenericLink
        .data[
          urlToGenericLink.data.length - 1
        ]?.payloadJson.isUrlSameForRole;
      if (!isUrlTheSame && !currentUser.presenter) {
        const viewerUrl = urlToGenericLink
          .data[
            urlToGenericLink.data.length - 1
          ]?.payloadJson.viewerUrl;
        if (viewerUrl) {
          setLink(viewerUrl);
          handleChangePresentationAreaContent(true);
        }
      } else {
        setLink(urlToGenericLink
          .data[
            urlToGenericLink.data.length - 1
          ]?.payloadJson.url);
        handleChangePresentationAreaContent(true);
      }
    } else if (
      urlToGenericLink.data
      && !urlToGenericLink
        .data[urlToGenericLink.data.length - 1]?.payloadJson
    ) {
      setLink(null);
      setPreviousModalState({
        isUrlSameForRole: true,
        url: null,
      });
      handleChangePresentationAreaContent(false);
    }
  }, [urlToGenericLink, currentUser]);

  useEffect(() => {
    if (currentUser?.presenter) {
      const actionDropdownItemsToRender = [
        new ActionButtonDropdownSeparator(),
      ];
      if (showingPresentationContent) {
        actionDropdownItemsToRender.push(new ActionButtonDropdownOption({
          label: 'Edit link(s)',
          icon: 'copy',
          tooltip: 'Edit previously set links',
          allowed: true,
          onClick: () => {
            setShowModal(true);
          },
        }));
      }
      actionDropdownItemsToRender.push(new ActionButtonDropdownOption({
        label: showingPresentationContent ? 'Remove link share' : 'Share link',
        icon: 'copy',
        tooltip: showingPresentationContent ? 'Remove generic link from presentation area'
          : 'Share a generic link into the presentation area',
        allowed: true,
        onClick: showingPresentationContent ? () => {
          deleteEntryUrlToGenericLink([RESET_DATA_CHANNEL]);
          setShowingPresentationContent(false);
        } : () => {
          setShowModal(true);
        },
      }));
      pluginApi.setActionButtonDropdownItems(actionDropdownItemsToRender);
    } else {
      pluginApi.setActionButtonDropdownItems([]);
    }
  }, [currentUser, showingPresentationContent]);

  useEffect(() => {
    if (link && link !== '') {
      pluginApi.setGenericContentItems([]);
      setGenericContentd(pluginApi.setGenericContentItems([
        new GenericContentMainArea({
          contentFunction: (element: HTMLElement) => {
            const root = ReactDOM.createRoot(element);
            root.render(
              <React.StrictMode>
                <GenericComponentLinkShare
                  link={link}
                />
              </React.StrictMode>,
            );
          },
        }),
      ])[0]);
    } else {
      pluginApi.setGenericContentItems([]);
    }
  }, [link]);

  return (
    <ModalToShareLink
      {...{
        setPreviousModalState,
        previousModalState,
        showModal,
        handleCloseModal,
        linkError,
        handleSendLinkToIframe,
        handleCheckboxChange,
        setLinkError,
      }}
    />
  );
}

export default GenericLinkShare;
