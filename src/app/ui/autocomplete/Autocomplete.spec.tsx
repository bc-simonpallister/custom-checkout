import { mount, render, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AutocompleteItem from './autocomplete-item';
import Autocomplete from './Autocomplete';

describe('Autocomplete Component', () => {
    const items: AutocompleteItem[] = [
        { label: 'foo', id: 'x', value: 'vfoo' },
        { label: 'bar', id: 'y', value: 'vbar' },
        {
            label: 'zoo',
            id: 'z',
            value: 'vzoo',
            highlightedSlices: [
                { offset: 0, length: 2 },
            ],
        },
    ];

    it('renders input with initial value', () => {
        const tree = render(<Autocomplete initialValue="fo" items={ items } />);

        expect(toJson(tree)).toMatchSnapshot();
    });

    describe('when the input value is changed', () => {
        let onChange: jest.Mock;
        let tree: ReactWrapper;

        beforeEach(() => {
            onChange = jest.fn();
            tree = mount(<Autocomplete onChange={ onChange } items={ items }><h1>Bob</h1></Autocomplete>);
            tree.find('input').simulate('change', { target: { value: 'zo' }});
        });

        it('triggers onChange function', () => {
            expect(onChange).toHaveBeenCalledWith('zo', false);
        });

        it('renders a PopoverList with the passed items', () => {
            expect(tree.find('PopoverList').length).toEqual(1);
            expect(tree.find('PopoverList').find('li').length).toEqual(3);
            expect(tree.find('PopoverList').find('strong').html()).toEqual('<strong>zo</strong>');
        });

        it('renders a PopoverList with the new value as highlighted text', () => {
            expect(tree.find('PopoverList').find('strong').html()).toEqual('<strong>zo</strong>');
        });

        it('renders passed child inside Popover', () => {
            expect(tree.find('Popover').find('h1').html()).toMatchSnapshot();
        });
    });

    describe('when an item is clicked', () => {
        let onSelect: jest.Mock;
        let tree: ReactWrapper;

        beforeEach(() => {
            onSelect = jest.fn();
            tree = mount(<Autocomplete onSelect={ onSelect } items={ items } />);
            tree.find('input')
                .simulate('change', { target: { value: 'zo' }});

            tree.find('li').first().simulate('click');
        });

        it('triggers onSelect', () => {
            expect(onSelect).toHaveBeenCalledWith({
                ...items[0],
                content: items[0].label,
            }, expect.anything());
        });

        it('closes popover', () => {
            expect(tree.find('PopoverList').length).toEqual(0);
        });

        it('populates input field with selected item', () => {
            expect(tree.find('input').prop('value')).toEqual('vfoo');
        });
    });

    describe('when an item is selected by keyboard', () => {
        let onSelect: jest.Mock;
        let tree: ReactWrapper;

        beforeEach(() => {
            onSelect = jest.fn();
            tree = mount(<Autocomplete onSelect={ onSelect } items={ items } />);
            tree.find('input')
                .simulate('change', { target: { value: 'zo' }})
                .simulate('keyDown', { key: 'ArrowDown', keyCode: 40, which: 40 })
                .simulate('keyDown', { key: 'Enter', keyCode: 13, which: 13 });
        });

        it('triggers onSelect', () => {
            expect(onSelect).toHaveBeenCalledWith({
                ...items[1],
                content: items[1].label,
            }, expect.anything());
        });

        it('closes popover', () => {
            expect(tree.find('PopoverList').length).toEqual(0);
        });

        it('populates input field with selected item', () => {
            expect(tree.find('input').prop('value')).toEqual('vbar');
        });
    });
});
