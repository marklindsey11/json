import React from "react";
import toast from "react-hot-toast";
import styled, { keyframes } from "styled-components";
import { Modal, ModalProps } from "src/components/Modal";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import packageJson from "package.json";
import { CgSpinner } from "react-icons/cg";

const StyledFlex = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:first-of-type {
    padding-top: 0;
    border: none;
  }
`;

const spin = keyframes`
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
}
`;

const StyledSpinner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 18px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  svg {
    animation: ${spin} 2s infinite;
  }
`;

const StyledInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.TEXT_DANGER};
  font-family: 'Roboto', sans-serif;
`;

const jsoncrackHost =
  process.env.NEXT_PUBLIC_JSONCRACK_HOST || packageJson.homepage;

export const ShareModal: React.FC<ModalProps & { shareId: string }> = ({
  shareId,
  visible,
  setVisible,
}) => {
  const embedText = `<iframe src="${jsoncrackHost}/widget?json=${shareId}" width="512" height="384" style="border: 2px solid #b9bbbe; border-radius: 6px;"></iframe>`;
  const shareURL = `${jsoncrackHost}/editor?json=${shareId}`;

  const handleShare = async (value: string) => {
    navigator.clipboard.writeText(value);

    toast.success(`Link copied to clipboard.`);
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Create a Share Link</Modal.Header>
      <Modal.Content>
        {shareId?.length ? (
          <>
            <StyledContainer>
              Share Link
              <StyledFlex>
                <Input value={shareURL} type="url" readOnly />
                <Button
                  status="SECONDARY"
                  onClick={() => handleShare(shareURL)}
                >
                  Copy
                </Button>
              </StyledFlex>
            </StyledContainer>
            <StyledContainer>
              Embed into your website
              <StyledFlex>
                <Input value={embedText} type="url" readOnly />
                <Button
                  status="SECONDARY"
                  onClick={() => handleShare(embedText)}
                >
                  Copy
                </Button>
              </StyledFlex>
            </StyledContainer>
            <StyledInfo>
              &#9888; <b>Links are kept for 7 days only!</b> This feature is
              currently in beta, links may be deleted at any time without
              notification.
            </StyledInfo>
          </>
        ) : (
          <StyledSpinner>
            <CgSpinner size={38} />
            Generating Share Link...
          </StyledSpinner>
        )}
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </Modal>
  );
};
