import { Suspense } from 'react';

import Loader from './Loader';

// Lazy loading with suspense in one single component
const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;