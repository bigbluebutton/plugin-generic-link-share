import * as React from 'react';
import * as ReactModal from 'react-modal';
import { useEffect, useState } from 'react';
import Iframe from 'react-iframe';

import './style.css';
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

  const styleOfPreviewButtonWrapper: React.CSSProperties = (urlToPreview) ? { display: 'flex', flexDirection: 'column' } : { display: 'flex' };
  const styleOfPreviewButton: React.CSSProperties = (!urlToPreview) ? { marginLeft: '3px' } : { marginTop: '3px' };
  const isUrlPreviewing = (urlToPreview && !urlToPreview?.isViewer);
  const isViewerUrlPreviewing = !!urlToPreview?.isViewer;
  return (
    <ReactModal
      className="plugin-modal"
      overlayClassName="modal-overlay"
      isOpen={showModal}
      onRequestClose={handleCloseModal}
    >
      <button
        type="button"
        className="clickable-close"
        onClick={() => {
          handleCloseModal();
        }}
      >
        <i
          className="icon-bbb-close"
        />
      </button>
      <div
        style={{
          width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex',
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
          {
            !linkError
              ? (
                <>
                  <h1 style={{ margin: '0' }}>Share your link</h1>
                  <form
                    className="form-to-send-url"
                    onSubmit={handleSendLinkToIframe}
                  >
                    <label
                      className="form-to-send-url-item form-checkbox-item"
                      htmlFor="same-links-for-pres-viewer"
                    >
                      <input
                        id="same-links-for-pres-viewer"
                        type="checkbox"
                        name="isUrlSameForRole"
                        checked={isUrlSameForRole}
                        onChange={handleCheckboxChange}
                      />
                      <span className="label-form label-form-checkbox">Same URL for presenter and viewers</span>
                    </label>
                    <label
                      htmlFor="link-receiver"
                      className="form-to-send-url-item"
                    >
                      <span className="label-form">{isUrlSameForRole ? 'URL: ' : 'Presenter Url: '}</span>
                      {isUrlAlreadyFormated
                        ? (
                          <span className="warning-iframe-message">
                            You can preview the link to see if it will work correctly
                            (It is highly recommended).
                          </span>
                        ) : null}
                      <div style={styleOfPreviewButtonWrapper}>
                        <input
                          className="label-form-text-input"
                          id="link-receiver"
                          value={url}
                          type="text"
                          name="link"
                          placeholder="https://..."
                          onChange={(e) => {
                            setPreviousModalState((p) => ({
                              isUrlSameForRole: p?.isUrlSameForRole,
                              url: e?.target?.value,
                              viewerUrl: p?.viewerUrl,
                            }));
                          }}
                        />
                        {(isUrlAlreadyFormated || isUrlPreviewing) ? (
                          <button
                            type="button"
                            style={styleOfPreviewButton}
                            className="button-style"
                            onClick={() => {
                              if (!isUrlPreviewing) {
                                setUrlToPreview({ url, isViewer: false });
                              } else {
                                setUrlToPreview(null);
                              }
                            }}
                          >
                            {
                              !isUrlPreviewing ? 'Show preview' : 'Hide preview'
                            }
                          </button>
                        ) : null}
                      </div>
                    </label>
                    {
                      !isUrlSameForRole
                        ? (
                          <label
                            htmlFor="extra-link-receiver"
                            className="form-to-send-url-item"
                          >
                            <span className="label-form">Viewer URL (It can be set later on): </span>
                            {isViewerUrlAlreadyFormated
                              ? (
                                <span className="warning-iframe-message">
                                  You can preview the link to see if it will work correctly
                                  (It is highly recommended).
                                </span>
                              ) : null}
                            <div style={styleOfPreviewButtonWrapper}>
                              <input
                                className="label-form-text-input"
                                id="extra-link-receiver"
                                value={viewerUrl}
                                type="text"
                                name="viewerLink"
                                placeholder="https://..."
                                onChange={(e) => {
                                  setPreviousModalState((p) => ({
                                    isUrlSameForRole: p?.isUrlSameForRole,
                                    url: p?.url,
                                    viewerUrl: e?.target?.value,
                                  }));
                                }}
                              />
                              {(isViewerUrlAlreadyFormated || isViewerUrlPreviewing) ? (
                                <button
                                  type="button"
                                  style={styleOfPreviewButton}
                                  className="button-style"
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
                                </button>
                              ) : null}
                            </div>
                          </label>
                        ) : null
                    }
                    <input className="button-style sending-button" type="submit" value="Share as content" />
                  </form>
                </>
              ) : (
                <div>
                  <h1>Error: </h1>
                  <div className="error-content-block">
                    <span className="error-span">{linkError}</span>
                    <button type="button" className="button-style" onClick={() => { setLinkError(null); }}>clear</button>
                  </div>
                </div>
              )
          }
        </div>
        {urlToPreview ? (
          <div
            style={{ height: '40vh', width: '100%' }}
          >
            <Iframe
              url={urlToPreview.url}
              width="100%"
              height="100%"
              display="block"
              position="relative"
            />
          </div>
        ) : null}
      </div>
    </ReactModal>
  );
}
