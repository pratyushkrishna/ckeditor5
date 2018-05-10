/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor';
import { _clear as clearTranslations, add as addTranslations } from '@ckeditor/ckeditor5-utils/src/translation-service';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';

import TableEditing from '../src/tableediting';
import TableUI from '../src/tableui';
import DropdownView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownview';

testUtils.createSinonSandbox();

describe( 'TableUI', () => {
	let editor, element;

	before( () => {
		addTranslations( 'en', {} );
		addTranslations( 'pl', {} );
	} );

	after( () => {
		clearTranslations();
	} );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return ClassicTestEditor
			.create( element, {
				plugins: [ TableEditing, TableUI ]
			} )
			.then( newEditor => {
				editor = newEditor;
			} );
	} );

	afterEach( () => {
		element.remove();

		return editor.destroy();
	} );

	describe( 'insertTable button', () => {
		let insertTable;

		beforeEach( () => {
			insertTable = editor.ui.componentFactory.create( 'insertTable' );
		} );

		it( 'should register insertTable buton', () => {
			expect( insertTable ).to.be.instanceOf( ButtonView );
			expect( insertTable.isOn ).to.be.false;
			expect( insertTable.label ).to.equal( 'Insert table' );
			expect( insertTable.icon ).to.match( /<svg / );
		} );

		it( 'should bind to insertTable command', () => {
			const command = editor.commands.get( 'insertTable' );

			command.isEnabled = true;
			expect( insertTable.isOn ).to.be.false;
			expect( insertTable.isEnabled ).to.be.true;

			command.isEnabled = false;
			expect( insertTable.isEnabled ).to.be.false;
		} );

		it( 'should execute insertTable command on button execute event', () => {
			const executeSpy = testUtils.sinon.spy( editor, 'execute' );

			insertTable.fire( 'execute' );

			sinon.assert.calledOnce( executeSpy );
			sinon.assert.calledWithExactly( executeSpy, 'insertTable' );
		} );
	} );

	describe( 'tableRow dropdown', () => {
		let dropdown;

		beforeEach( () => {
			dropdown = editor.ui.componentFactory.create( 'tableRow' );
		} );

		it( 'have button with proper properties set', () => {
			expect( dropdown ).to.be.instanceOf( DropdownView );

			const button = dropdown.buttonView;

			expect( button.isOn ).to.be.false;
			expect( button.tooltip ).to.be.true;
			expect( button.label ).to.equal( 'Column' );
			expect( button.icon ).to.match( /<svg / );
		} );

		it( 'should have proper items in panel', () => {
			const listView = dropdown.listView;

			const labels = listView.items.map( ( { label } ) => label );

			expect( labels ).to.deep.equal( [ 'Insert row below', 'Insert row above', 'Delete row' ] );
		} );

		it( 'should bind items in panel to proper commands', () => {
			const items = dropdown.listView.items;

			const insertRowBelowCommand = editor.commands.get( 'insertRowBelow' );
			const insertRowAboveCommand = editor.commands.get( 'insertRowAbove' );
			const removeRowCommand = editor.commands.get( 'removeRow' );

			insertRowBelowCommand.isEnabled = true;
			insertRowAboveCommand.isEnabled = true;
			removeRowCommand.isEnabled = true;

			expect( items.get( 0 ).isEnabled ).to.be.true;
			expect( items.get( 1 ).isEnabled ).to.be.true;
			expect( items.get( 2 ).isEnabled ).to.be.true;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			insertRowBelowCommand.isEnabled = false;

			expect( items.get( 0 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			insertRowAboveCommand.isEnabled = false;

			expect( items.get( 1 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			removeRowCommand.isEnabled = false;
			expect( items.get( 2 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.false;
		} );
	} );

	describe.only( 'tableColumn button', () => {
		let dropdown;

		beforeEach( () => {
			dropdown = editor.ui.componentFactory.create( 'tableColumn' );
		} );

		it( 'have button with proper properties set', () => {
			expect( dropdown ).to.be.instanceOf( DropdownView );

			const button = dropdown.buttonView;

			expect( button.isOn ).to.be.false;
			expect( button.tooltip ).to.be.true;
			expect( button.label ).to.equal( 'Row' );
			expect( button.icon ).to.match( /<svg / );
		} );

		it( 'should have proper items in panel', () => {
			const listView = dropdown.listView;

			const labels = listView.items.map( ( { label } ) => label );

			expect( labels ).to.deep.equal( [ 'Insert column before', 'Insert column after', 'Delete column' ] );
		} );

		it( 'should bind items in panel to proper commands', () => {
			const items = dropdown.listView.items;

			const insertColumnBeforeCommand = editor.commands.get( 'insertColumnBefore' );
			const insertColumnAfterCommand = editor.commands.get( 'insertColumnAfter' );
			const removeColumnCommand = editor.commands.get( 'removeColumn' );

			insertColumnBeforeCommand.isEnabled = true;
			insertColumnAfterCommand.isEnabled = true;
			removeColumnCommand.isEnabled = true;

			expect( items.get( 0 ).isEnabled ).to.be.true;
			expect( items.get( 1 ).isEnabled ).to.be.true;
			expect( items.get( 2 ).isEnabled ).to.be.true;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			insertColumnBeforeCommand.isEnabled = false;

			expect( items.get( 0 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			insertColumnAfterCommand.isEnabled = false;

			expect( items.get( 1 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.true;

			removeColumnCommand.isEnabled = false;
			expect( items.get( 2 ).isEnabled ).to.be.false;
			expect( dropdown.buttonView.isEnabled ).to.be.false;
		} );
	} );
} );
