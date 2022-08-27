import { NodeData, EdgeData } from "reaflow";
import { parser } from "src/utils/json-editor-parser";
import dagre from "dagre";
import { Position } from "react-flow-renderer";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.data.width,
      height: node.data.height,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const mappedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - node.data.width / 2,
        y: nodeWithPosition.y - node.data.height / 2,
      },
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    };
  });

  return { nodes: mappedNodes, edges };
};

export function getEdgeNodes(
  graph: string,
  isExpanded: boolean = true
): {
  nodes: NodeData[];
  edges: EdgeData[];
} {
  const elements = parser(JSON.parse(graph));

  let nodes: NodeData[] = [],
    edges: EdgeData[] = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (isNode(el)) {
      const text = renderText(el.text);
      const lines = text.split("\n");
      const lineLengths = lines
        .map((line) => line.length)
        .sort((a, b) => a - b);
      const longestLine = lineLengths.reverse()[0];

      const height = lines.length * 17.8 < 30 ? 40 : lines.length * 17.8;
      nodes.push({
        id: el.id,
        data: {
          label: el.text,
          isParent: el.parent,
          width: isExpanded ? 35 + longestLine * (el.parent ? 9 : 8) : 180,
          height,
        },
        type: el.text instanceof Object ? "objectNode" : "textNode",
        position: {
          x: 0,
          y: 0,
        },
      });
    } else {
      edges.push(el);
    }
  }

  return {
    nodes,
    edges,
  };
}

export function getNextLayout(layout: "TB" | "LR") {
  switch (layout) {
    case "LR":
      return "TB";

    default:
      return "LR";
  }
}

function renderText(value: string | object) {
  if (value instanceof Object) {
    let temp = "";
    const entries = Object.entries(value);

    if (Object.keys(value).every((val) => !isNaN(+val))) {
      return Object.values(value).join("");
    }

    entries.forEach((entry) => {
      temp += `${entry[0]}: ${String(entry[1])}\n`;
    });

    return temp;
  }

  return value;
}

function isNode(element: NodeData | EdgeData) {
  if ("text" in element) return true;
  return false;
}
