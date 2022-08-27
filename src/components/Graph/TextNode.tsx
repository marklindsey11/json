import React from "react";
import { Handle, Position } from "react-flow-renderer";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";

const StyledNode = styled.div<{
  objectKey?: boolean;
  parent?: boolean;
  width: number;
  height: number;
}>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2b2c3e;
  border: 2px solid #475872;
  border-radius: 4px;
  padding: 4px 10px;
  font-weight: 500;
  color: ${({ theme, objectKey, parent }) =>
    parent
      ? theme.NODE_KEY
      : objectKey
      ? theme.OBJECT_KEY
      : theme.TEXT_POSITIVE};
  font-size: 15px;
`;

export const TextNode = ({ data }) => {
  const layout = useConfig((state) => state.layout);
  const isVertical = layout === "TB";

  return (
    <StyledNode parent={data.isParent} width={data.width} height={data.height}>
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
      {data.label}
    </StyledNode>
  );
};
