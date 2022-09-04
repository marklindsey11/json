import React from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { Modal, ModalProps } from "src/components/Modal";
import { Button } from "src/components/Button";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";
import { BiErrorAlt } from "react-icons/bi";
import useConfig from "src/hooks/store/useConfig";
import { Input } from "src/components/Input";
import packageJson from "package.json";
import axios from "axios";

const StyledWarning = styled.p``;

const StyledErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.TEXT_DANGER};
  font-weight: 600;
`;

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

const jsoncrackHost =
  process.env.NEXT_PUBLIC_JSONCRACK_HOST || packageJson.homepage;

const createWorker = createWorkerFactory(() => import("./worker"));

export const ShareModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const json = useConfig((state) => state.json);
  const worker = useWorker(createWorker);
  const [encodedJson, setEncodedJson] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(true);

  const embedText = `<iframe src="${jsoncrackHost}/widget?json=${encodedJson}" width="512" height="384" style="border: 2px solid #b9bbbe; border-radius: 6px;"></iframe>`;
  const shareURL = `${jsoncrackHost}/editor?json=${encodedJson}`;

  React.useEffect(() => {
    (async () => {
      try {
        const encoded = await worker.compressor(json);

        const url = await axios.post(
          "https://api.buildable.dev/@62190653596cdb0012a7f3b1/test/add-json",
          { json: encoded }
        );

        setEncodedJson(url.data.id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    })();

    return () => setIsGenerating(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleShare = async (value: string) => {
    navigator.clipboard.writeText(value);

    toast.success(`Link copied to clipboard.`);
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Create a Share Link</Modal.Header>
      <Modal.Content>
        {isGenerating ? (
          <StyledErrorWrapper>
            <BiErrorAlt size={60} />
            <StyledWarning>Generating Share URL</StyledWarning>
          </StyledErrorWrapper>
        ) : (
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
          </>
        )}
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </Modal>
  );
};
