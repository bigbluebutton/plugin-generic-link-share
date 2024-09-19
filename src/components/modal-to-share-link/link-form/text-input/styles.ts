import styled from 'styled-components';
import { ButtonStyleProps } from './types';
import { FormToSendUrlItem as FormToSendUrlItemCommon } from '../styles';

const colorGray = 'var(--color-gray, #4E5A66)';
const borderSize = '2px';

export const LabelFormTextInput = styled.input`
  width: 100%;

  &::placeholder {
    color: #555;
  }
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

export const LabelForm = styled.label`
  margin-right: 5px;
`;

export const FormToSendUrlItem = styled(FormToSendUrlItemCommon)``;
