import * as React from 'react';
import { useEffect, useState } from 'react';
import Iframe from 'react-iframe';

import * as Styled from './styles';

import { ModalToShareLinkProps } from './types';
import { REGEX } from '../generic-link-share/constants';

interface UrlPreview {
  url: string;
  isViewer: boolean;
}

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

  const styleOfPreviewButtonWrapper: React.CSSProperties = urlToPreview
    ? { display: 'flex', flexDirection: 'column' }
    : { display: 'flex' };
  const styleOfPreviewButton: React.CSSProperties = !urlToPreview
    ? { marginLeft: '3px' }
    : { marginTop: '3px' };

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
          {!linkError ? (
            <>
              <h1 style={{ margin: '0' }}>Share your link</h1>
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
                <Styled.FormToSendUrlItem as="label" htmlFor="link-receiver">
                  <Styled.LabelForm>
                    {isUrlSameForRole ? 'URL: ' : 'Presenter URL: '}
                  </Styled.LabelForm>
                  {isUrlAlreadyFormated && (
                    <Styled.WarningIframeMessage>
                      Click to preview the website
                      and check if it works correctly when embedded (recommended)
                    </Styled.WarningIframeMessage>
                  )}
                  <div style={styleOfPreviewButtonWrapper}>
                    <Styled.LabelFormTextInput
                      id="link-receiver"
                      value={url}
                      type="text"
                      name="link"
                      placeholder="https://..."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPreviousModalState((p) => ({
                          isUrlSameForRole: p?.isUrlSameForRole,
                          url: e?.target?.value,
                          viewerUrl: p?.viewerUrl,
                        }));
                      }}
                    />
                    {(isUrlAlreadyFormated || isUrlPreviewing) && (
                      <Styled.ButtonStyle
                        style={styleOfPreviewButton}
                        onClick={() => {
                          if (!isUrlPreviewing) {
                            setUrlToPreview({ url, isViewer: false });
                          } else {
                            setUrlToPreview(null);
                          }
                        }}
                      >
                        {!isUrlPreviewing ? 'Show preview' : 'Hide preview'}
                      </Styled.ButtonStyle>
                    )}
                  </div>
                </Styled.FormToSendUrlItem>
                {!isUrlSameForRole && (
                  <Styled.FormToSendUrlItem as="label" htmlFor="extra-link-receiver">
                    <Styled.LabelForm>Viewer URL (It can be set later on): </Styled.LabelForm>
                    {isViewerUrlAlreadyFormated && (
                      <Styled.WarningIframeMessage>
                        Click to preview the website
                        and check if it works correctly when embedded (recommended)
                      </Styled.WarningIframeMessage>
                    )}
                    <div style={styleOfPreviewButtonWrapper}>
                      <Styled.LabelFormTextInput
                        id="extra-link-receiver"
                        value={viewerUrl}
                        type="text"
                        name="viewerLink"
                        placeholder="https://..."
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setPreviousModalState((p) => ({
                            isUrlSameForRole: p?.isUrlSameForRole,
                            url: p?.url,
                            viewerUrl: e?.target?.value,
                          }));
                        }}
                      />
                      {(isViewerUrlAlreadyFormated || isViewerUrlPreviewing) && (
                        <Styled.ButtonStyle
                          style={styleOfPreviewButton}
                          title="Click to preview the website and check if it works correctly when embedded (recommended)"
                          onClick={() => {
                            if (!isViewerUrlPreviewing) {
                              setUrlToPreview({ url: viewerUrl, isViewer: true });
                            } else {
                              setUrlToPreview(null);
                            }
                          }}
                        >
                          {!isViewerUrlPreviewing ? 'Show preview' : 'Hide preview'}
                        </Styled.ButtonStyle>
                      )}
                    </div>
                  </Styled.FormToSendUrlItem>
                )}
                <Styled.SendingButton type="submit">Share as content</Styled.SendingButton>
              </Styled.FormToSendUrl>
            </>
          ) : (
            <div>
              <h1>Error: </h1>
              <Styled.ErrorContentBlock>
                <Styled.ErrorSpan>{linkError}</Styled.ErrorSpan>
                <Styled.ButtonStyle onClick={() => setLinkError(null)}>clear</Styled.ButtonStyle>
              </Styled.ErrorContentBlock>
            </div>
          )}
        </div>
        {urlToPreview && (
          <div style={{ height: '40vh', width: '100%' }}>
            <Iframe url={urlToPreview.url} width="100%" height="100%" display="block" position="relative" />
          </div>
        )}
      </div>
    </Styled.PluginModal>
  );
}
