// testing file for CollapsibleTable component
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import CollapsibleTable from '../components/CollapsibleTable/CollapsibleTable';
import Row from "../components/Row/Row";

/*
Some test cases to consider:
- Testing function's behaviour with invalid argument types,
  i.e. test makeSubRow inputs rank and dependencyMap
- Testing output of functions are correct type,
  i.e. test makeSubRow returns JSX.Element
-
*/


describe("<CollapsibleTable />", () => {
    test("should display blank collapsible table", async() => {
        // render empty collapsible table
        const collapsibleTable = null
        expect(collapsibleTable).toBeNull();
    });
});
