import * as React from 'react';
import { useEffect, useState } from 'react';
import Iframe from 'react-iframe';

import * as Styled from './styles';

import { ModalToShareLinkProps, UrlPreview } from './types';
import { REGEX } from '../generic-link-share/constants';
import { TextInputComponent } from './text-input/component';

export function ModalToShareLink(props: ModalToShareLinkProps) {
  const {
    previousModalState,
    setPreviousModalState,
    showModal,
    handleCloseModal,
    linkError,
    handleSendLinkToIframe,
    handleCheckboxChange,
    setLinkError,
  } = props;

  const [isUrlAlreadyFormated, setIsUrlAlreadyFormated] = useState<boolean>(false);
  const [isViewerUrlAlreadyFormated, setIsViewerUrlAlreadyFormated] = useState<boolean>();

  const [urlToPreview, setUrlToPreview] = useState<UrlPreview>(null);

  const {
    isUrlSameForRole = true,
    url: incomingUrl,
    viewerUrl: incomingViewerUrl,
  } = previousModalState;

  const url = incomingUrl || '';
  const viewerUrl = incomingViewerUrl || '';

  useEffect(() => {
    if (url.match(REGEX)) {
      setIsUrlAlreadyFormated(true);
    } else setIsUrlAlreadyFormated(false);
    if (viewerUrl.match(REGEX)) {
      setIsViewerUrlAlreadyFormated(true);
    } else setIsViewerUrlAlreadyFormated(false);
  }, [previousModalState]);

  const isUrlPreviewing = urlToPreview && !urlToPreview?.isViewer;
  const isViewerUrlPreviewing = !!urlToPreview?.isViewer;

  return (
    <Styled.PluginModal
      className="modal-high"
      overlayClassName="modalOverlay"
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={handleCloseModal}
    >
      <Styled.ClickableClose
        type="button"
        onClick={() => {
          handleCloseModal();
        }}
      >
        <i className="icon-bbb-close" />
      </Styled.ClickableClose>
      <div
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        {urlToPreview && (
          <div style={{ height: '40vh', width: '100%' }}>
            <Iframe url={urlToPreview.url} width="100%" height="100%" display="block" position="relative" />
          </div>
        )}
        <div
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
          }}
        >
          <h1 style={{ margin: '0' }}>Share your link</h1>
          {!linkError ? (
            <Styled.FormToSendUrl onSubmit={handleSendLinkToIframe}>
              <Styled.FormToSendUrlItem isCheckboxItem as="label" htmlFor="same-links-for-pres-viewer">
                <input
                  id="same-links-for-pres-viewer"
                  type="checkbox"
                  name="isUrlSameForRole"
                  checked={isUrlSameForRole}
                  onChange={handleCheckboxChange}
                />
                <Styled.LabelFormCheckbox>
                  Same URL for presenter and viewers
                </Styled.LabelFormCheckbox>
              </Styled.FormToSendUrlItem>
              <TextInputComponent
                setPreviousModalState={setPreviousModalState}
                isUrlSameForRole={isUrlSameForRole}
                isUrlAlreadyFormated={isUrlAlreadyFormated}
                isUrlPreviewing={isUrlPreviewing}
                urlToPreview={urlToPreview}
                url={url}
                setUrlToPreview={setUrlToPreview}
                isViewer={false}
              />
              {!isUrlSameForRole && (
                <TextInputComponent
                  setPreviousModalState={setPreviousModalState}
                  isUrlSameForRole={isUrlSameForRole}
                  isUrlAlreadyFormated={isViewerUrlAlreadyFormated}
                  isUrlPreviewing={isViewerUrlPreviewing}
                  urlToPreview={urlToPreview}
                  setUrlToPreview={setUrlToPreview}
                  url={viewerUrl}
                  isViewer
                />
              )}
              {(isUrlAlreadyFormated || isViewerUrlAlreadyFormated) && (
                <Styled.WarningIframeMessage>
                  Click show preview to check if it
                  the website works correctly when embedded (recommended)
                </Styled.WarningIframeMessage>
              )}
              <Styled.BottomSeparator />
              <Styled.ButtonsWrapper>
                <Styled.ButtonStyle
                  style={{ marginRight: '.3rem' }}
                  color="secondary"
                  onClick={() => {
                    setPreviousModalState({
                      isUrlSameForRole: true,
                      url: '',
                      viewerUrl: '',
                    });
                    setUrlToPreview(null);
                    handleCloseModal();
                  }}
                >
                  Cancel
                </Styled.ButtonStyle>
                <Styled.SendingButton type="submit" value="Share as content" />
              </Styled.ButtonsWrapper>
            </Styled.FormToSendUrl>
          ) : (
            <div>
              <h1>Error: </h1>
              <Styled.ErrorContentBlock>
                <Styled.ErrorSpan>{linkError}</Styled.ErrorSpan>
                <Styled.ButtonStyle onClick={() => setLinkError(null)}>
                  clear
                </Styled.ButtonStyle>
              </Styled.ErrorContentBlock>
            </div>
          )}
        </div>
      </div>
    </Styled.PluginModal>
  );
}
