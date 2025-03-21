import { RouteObject } from 'react-router';
import { BuildInfoComponent } from '@/components/build-info/build-info';
import { OpenCVComponent } from './opencv/opencv';
import { LayoutComponent } from '@/components/layout/layout';
import { HumanComponent } from './human/human';
import { CatsComponent } from './cats/cats';
import { TensorFlowComponent } from './tensorflow/tensorflow';

type RouteObjectWithMeta = RouteObject & {
  children?: RouteObjectWithMeta[];
  meta?: any;
};

const routes: RouteObjectWithMeta[] = [
  {
    path: '/',
    element: <LayoutComponent />,
    children: [
      {
        path: 'opencv',
        element: <OpenCVComponent />,
        children: [
          {
            index: true,
            element: <BuildInfoComponent />,
          },
          {
            path: 'human',
            element: <HumanComponent />,
          },
          {
            path: 'cats',
            element: <CatsComponent />,
          },
        ],
      },
      {
        path: 'tensorflow',
        element: <TensorFlowComponent />,
      },
    ],
  },
];

export { routes };
