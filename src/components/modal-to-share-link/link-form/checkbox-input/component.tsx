import * as React from 'react';
import * as Styled from './styles';
import { CheckboxInputComponentProps } from './types';

export function CheckboxInputComponent(props: CheckboxInputComponentProps) {
  const {
    isUrlSameForRole,
    handleCheckboxChange,
  } = props;
  return (
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
  );
}
