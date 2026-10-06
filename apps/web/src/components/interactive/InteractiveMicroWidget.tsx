import React from 'react';
import { SoftmaxTemperatureWidget } from './SoftmaxTemperatureWidget';
import { PagedAttentionWidget } from './PagedAttentionWidget';
import { CosineSimilarityWidget } from './CosineSimilarityWidget';
import { RopeRotationWidget } from './RopeRotationWidget';

export type InteractiveWidgetType =
  | 'softmax-temperature'
  | 'paged-attention'
  | 'vector-similarity'
  | 'rope-rotation';

interface InteractiveMicroWidgetProps {
  widgetId: InteractiveWidgetType;
}

export const InteractiveMicroWidget: React.FC<InteractiveMicroWidgetProps> = ({ widgetId }) => {
  switch (widgetId) {
    case 'softmax-temperature':
      return <SoftmaxTemperatureWidget />;
    case 'paged-attention':
      return <PagedAttentionWidget />;
    case 'vector-similarity':
      return <CosineSimilarityWidget />;
    case 'rope-rotation':
      return <RopeRotationWidget />;
    default:
      return null;
  }
};
