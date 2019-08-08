import React, { FunctionComponent } from 'react';

import withIconContainer from './withIconContainer';

const IconChevronDown: FunctionComponent = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
    </svg>
);

export default withIconContainer(IconChevronDown);
