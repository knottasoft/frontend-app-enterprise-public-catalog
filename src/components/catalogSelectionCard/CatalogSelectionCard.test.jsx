import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  SEARCH_FACET_FILTERS,
  SearchContext,
  setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import { render, screen } from '@testing-library/react';
import { CardCheckbox } from './CatalogSelectionCard';
import { QUERY_TITLE_REFINEMENT } from '../../constants';

const dispatchSpy = jest.fn();
const DEFAULT_SEARCH_CONTEXT_VALUE = { refinements: {}, dispatch: dispatchSpy };

// eslint-disable-next-line react/prop-types
const SearchDataWrapper = ({ children, searchContextValue }) => (
  <SearchContext.Provider
    value={searchContextValue}
    searchFacetFilters={
        [...SEARCH_FACET_FILTERS, { attribute: QUERY_TITLE_REFINEMENT, title: 'Titles' }]
      }
  >
    {children}
  </SearchContext.Provider>
);

describe('CardCheckbox', () => {
  beforeEach(() => {
    dispatchSpy.mockReset();
  });
  it('renders a checkbox and label', () => {
    const tree = renderer.create(
      <SearchDataWrapper
        searchContextValue={DEFAULT_SEARCH_CONTEXT_VALUE}
      >
        <CardCheckbox
          label="foo"
          queryTitle="bar"
          labelDetail="baz"
        />
      </SearchDataWrapper>,
    );
    expect(tree).toMatchSnapshot();
  });
  it('is checked when title is included in the query param', () => {
    const queryTitle = 'bar';
    const refinements = { refinements: { [QUERY_TITLE_REFINEMENT]: [queryTitle] } };
    const tree = renderer.create(
      <SearchDataWrapper
        searchContextValue={refinements}
      >
        <CardCheckbox
          label="foo"
          queryTitle={queryTitle}
          labelDetail="baz"
        />
      </SearchDataWrapper>,
    );
    expect(tree).toMatchSnapshot();
  });
  it('dispatches setRefinement action when radio selected', () => {
    const label = 'Check me';
    const queryTitle = 'titleforyou';
    render(
      <SearchDataWrapper searchContextValue={DEFAULT_SEARCH_CONTEXT_VALUE}>
        <CardCheckbox
          label={label}
          queryTitle={queryTitle}
          labelDetail="baz"
        />
      </SearchDataWrapper>,
    );
    const input = screen.getByLabelText(label);
    userEvent.click(input);
    expect(dispatchSpy).toHaveBeenLastCalledWith(setRefinementAction(QUERY_TITLE_REFINEMENT, [queryTitle]));
  });
});
