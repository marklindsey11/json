import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { LinkItUrl } from "react-linkify-it";
import useConfig from "src/hooks/store/useConfig";
import styled, { DefaultTheme } from "styled-components";

function getTypeColor(value: string, theme: DefaultTheme) {
  if (!Number.isNaN(+value)) return "#FD0079";
  if (value === "true") return theme.TEXT_POSITIVE;
  if (value === "false") return theme.TEXT_DANGER;
}

export const StyledLinkItUrl = styled(LinkItUrl)`
  text-decoration: underline;
  pointer-events: all;
`;

const StyledNode = styled.div<{
  objectKey?: boolean;
  parent?: boolean;
  width: number;
  height: number;
}>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  background: #2b2c3e;
  border: 2px solid #475872;
  border-radius: 4px;
  padding: 0 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  font-size: 12px;
  font-family: Roboto Mono, monospace;
  min-width: 50px;
`;

export const StyledRow = styled.span<{ value: string }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme, value }) => getTypeColor(value, theme)};
`;

export const StyledKey = styled.span<{
  objectKey?: boolean;
  parent?: boolean;
}>`
  font-weight: 500;
  color: ${({ theme, objectKey }) =>
    objectKey ? theme.OBJECT_KEY : theme.NODE_KEY};
`;

export const StyledText = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 50;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  gap: 2px;
`;

export const ObjectNode = ({ data }) => {
  const layout = useConfig((state) => state.layout);
  const values = Object.entries<string>(data.label);
  const isVertical = layout === "TB";

  return (
    <StyledNode width={data.width} height={data.height}>
      <Handle
        type="target"
        position={isVertical ? Position.Top : Position.Left}
        isConnectable
      />
      <Handle
        type="source"
        position={isVertical ? Position.Bottom : Position.Right}
        isConnectable
      />

      {values.map((val, idx) => (
        <StyledRow
          data-key={JSON.stringify(val[1])}
          key={idx}
          value={JSON.stringify(val[1])}
        >
          <StyledKey objectKey>
            {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
          </StyledKey>
          <StyledLinkItUrl>{JSON.stringify(val[1])}</StyledLinkItUrl>
        </StyledRow>
      ))}
    </StyledNode>
  );
};
