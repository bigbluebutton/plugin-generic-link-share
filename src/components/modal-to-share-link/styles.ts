import styled, { css } from 'styled-components';
import ReactModal from 'react-modal';
import { ButtonStyleProps, FormToSendUrlItemProps } from './types';

const colorGray = 'var(--color-gray, #4E5A66)';
const borderSizeSmall = '1px';
const borderSize = '2px';
const colorGrayLightest = 'var(--color-gray-lightest, #D4D9DF)';
const lineHeightComputed = '1rem';
const mdPaddingX = '1rem';

export const PluginModal = styled(ReactModal)`
  position: relative;
  z-index: 1000 !important;
  outline: transparent;
  outline-width: 2px;
  outline-style: solid;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
  background-color: #fff !important;
  width: 60vw;
  border-radius: 0.2rem;
  overflow: auto;
  overflow-y: hidden;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb:active {
    background: rgba(0, 0, 0, 0.25);
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  @media only screen and (max-width: 40em) {
    max-width: 95vw;
  }

  @media only screen and (min-width: 40.063em) {
    max-width: 80vw;
  }
`;

export const ButtonsWrapper = styled.div`
  align-self: flex-end;
`;

export const ButtonStyle = styled.button<ButtonStyleProps>`
  border: 3px solid transparent;
  overflow: visible;
  display: inline-block;
  border-radius: 2px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  padding: 0.45rem 1rem;
  align-self: flex-start;

  ${({ color }) => color === 'secondary' && `
    background: transparent;
    color: ${colorGray};
    border: 3px solid transparent;
    border-radius: 4px;
  

    &:focus {
      background: hsl(210, 30%, 95%);
      box-shadow: 0 0 0 ${borderSize} hsl(211, 87%, 80%);
    }

    &:hover {
      background: hsl(210, 30%, 95%);
      color: hsl(210, 13%, 35%);
    }

    &:active {
      background: hsl(210, 30%, 89%);
      color: hsl(210, 13%, 30%);
    }

    &:hover {
      &:focus {
        background: hsl(210, 30%, 95%);
        color: hsl(210, 13%, 30%);
        box-shadow: 0 0 0 ${borderSize} hsl(211, 87%, 80%);
      }
    }

    &:focus {
      &:active {
        background: hsl(210, 30%, 89%);
        color: hsl(210, 13%, 30%);
        box-shadow: 0 0 0 ${borderSize} hsl(211, 87%, 80%);
      }
    }
  `}

  &:hover {
    border: 3px solid #0f70d7;
  }
`;

export const WarningIframeMessage = styled.p`
  color: #4e5a66;
  font-size: 0.875rem;
  font-style: italic;
  margin: .5rem 0 0 0;
`;

export const SendingButton = styled.input`
  border: 3px solid transparent;
  overflow: visible;
  display: inline-block;
  border-radius: 2px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;

  &:hover {
    border: 3px solid #0f70d7;
  }
  padding: 0.45rem 1rem;
  background-color: #0f70d7;
  color: #fff;
  font-size: calc(1rem * 0.85);
`;

export const LabelForm = styled.label`
  margin-right: 5px;
`;

export const FormToSendUrl = styled.form`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  width: 80%;
`;

export const FormToSendUrlItem = styled.div<FormToSendUrlItemProps>`
  display: flex;
  ${({ isCheckboxItem }) => (
    isCheckboxItem
      ? css`
        flex-direction: row;
        align-items: center;
      `
      : css`
        flex-direction: column;
      `
  )}
  width: 100%;
`;

export const ClickableClose = styled.button`
  align-self: flex-end;
  margin: 5px 0 0 0;
  font-size: 40px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  border: none;

  &:hover {
    background-color: #eee;
  }
`;

export const LabelFormCheckbox = styled.span`
  margin-left: 10px;
`;

export const LabelFormTextInput = styled.input`
  width: 100%;

  &::placeholder {
    color: #555;
  }
`;

export const ErrorSpan = styled.span`
  background-color: rgba(223, 39, 33, 0.25);
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 15px;
`;

export const ErrorContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const BottomSeparator = styled.div`
  position: relative;
  width: 100%;
  height: ${borderSizeSmall};
  align-self: center;
  background-color: ${colorGrayLightest};
  margin: calc(${lineHeightComputed} * 2) ${mdPaddingX} calc(${lineHeightComputed} * 1.75) ${mdPaddingX};
`;
