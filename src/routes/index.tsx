import { Navigate, RouteObject } from 'react-router';
import { BuildInfoComponent } from '@/components/build-info/build-info';
import { OpenCVComponent } from './opencv/opencv';
import { LayoutComponent } from '@/components/layout/layout';
import { HumanComponent } from './human/human';
import { CatsComponent } from './cats/cats';

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
        index: true,
        element: <Navigate to="/opencv" />,
      },
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
    ],
  },
];

export { routes };
