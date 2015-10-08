import Ember from 'ember';
import layout from '../templates/components/ek-selectize';

export default Ember.Component.extend({
    layout: layout,

    tagName: "select",
    classNames: ['x-selectize'],
    attributeBindings: ['disabled', 'tabindex', 'multiple', 'form', 'name', 'autofocus', 'required', 'size', 'title'],

    /**
    * Bound to the `disabled` attribute on the native <select> tag.
    *
    * @property disabled
    * @type Boolean
    * @default false
    */
    disabled: false,

    /**
    * Bound to the `multiple` attribute on the native <select> tag.
    *
    * @property multiple
    * @type Boolean
    * @default false
    */
    multiple: false,

    /**
    * Bound to the `tabindex` attribute on the native <select> tag.
    *
    * @property tabindex
    * @type Integer
    * @default 0
    */
    tabindex: 0,

    /**
    * Alias to `value`.
    * This way we accept `value` or `selection` properties.
    *
    * @property selection
    */
    selection: Ember.computed.alias('value'),

    /**
    * Alias to `prompt`.
    * This way we accept `prompt` or `placeholder` properties.
    *
    * @property placeholder
    */
    placeholder: Ember.computed.alias('prompt'),


    /**
    * Alias to `prompt`.
    * This way we accept `prompt` or `placeholder` properties.
    *
    * @private
    * @property initState
    * @type booleadn
    */
    initState: true,

    /**
    * Specify the property name where to fetch the value
    * in the content
    *
    * @property optionValuePath
    * @type string
    * @default 'content.value'
    */
    optionValuePath: 'content.value',

    /**
    * Specify the property name where to fetch the label
    * in the content
    *
    * @property optionValueLabel
    * @type string
    * @default 'content.label'
    */
    optionLabelPath: 'content.label',


    /**
    * Removes the 'content' prefix of the 'optionValuePath' property
    *
    * @private
    * @property valueField
    * @type string
    */
    valueField: Ember.computed('optionValuePath', function() {
        return this.get('optionValuePath').split('.').slice(1).join('.');
    }),

    /**
    * Removes the 'content' prefix of the 'optionLabelPath' property
    *
    * @private
    * @property labelField
    * @type string
    */
    labelField: Ember.computed('optionLabelPath', function() {
        return this.get('optionLabelPath').split('.').slice(1).join('.');
    }),


    /**
    * The content used to populate options. Used only with autosuggest
    * feature.
    *
    * @property content
    * @type array
    */
    content: Ember.computed(function() {
        return Ember.A();
    }),


    /**
    * The content proceed to be understand by selectize. It replace
    * the value and label field by the one specified via optionValuePath
    * and optionLabelPath.
    *
    * @private
    * @property proceedContent
    * @type array
    */
    proceedContent: Ember.computed('content.[]', 'valueField', 'labelField', function() {
        let valueField = this.get('valueField');
        let labelField = this.get('labelField');

        let content = this.get('content');

        if (Ember.isArray(content)) {

            return content.map((item) => {
                return {
                    value: item[valueField],
                    text: item[labelField]
                };
            });
        }

        return Ember.A();

    }),

    /**
    * Initialize selectize on the component
    *
    * @private
    */
    initialize: Ember.on('didInsertElement', function() {

        let placeholder = this.get('placeholder');

        let $select = this.$().selectize({
            placeholder: placeholder
        });

        this._selectize = $select[0].selectize;

        this._selectize.on('type', (searchTerm) => {
            this.set('initState', false);
            this.sendAction('onSearch', searchTerm);
        });

        this._selectize.on('item_remove', () => {
            if (this.set('initState')) {
                this.set('initState', false);
                this.sendAction('onSearch', '');
            }
        });

        Ember.run.scheduleOnce('afterRender', this, () => {
            let content = this.get('proceedContent');
            this._selectize.addOption(content);
            this._selectize.setValue(this.get('value'));
            this._selectize.refreshOptions(false);
        });
    }),


    /**
    * Observers the proceedContent and update selectize options
    *
    * @private
    */
    onContentChanged: Ember.observer('proceedContent.[]', function() {
        let content = this.get('proceedContent');

        this._selectize.clearOptions();
        this._selectize.addOption(content);

        if (content.length === 1 && this.get('initState')) {
            this._selectize.setValue(content[0].value);
        }

        this._selectize.refreshOptions(false);
    }),

    /**
    * Observers the value passed and update the selected option
    *
    * @private
    */
    onSelectionChanged: Ember.observer('value', function() {
        let value = this.get('value');
        if (this._selectize.getValue() !== value) {
            this._selectize.setValue(value);
        }
    }),

    /**
    * onChange event
    * Set the new value to the `value` property
    *
    * @event - the event triggered when selecting an item
    */
    change(event) {
        let selectedOptions = event.target.selectedOptions;
        if (selectedOptions.length) {
            let value = selectedOptions[0].value;
            this.set('value', value);
        }
    },


    /**
    * Destroy the component
    *
    * @private
    */
    destroy: Ember.on('willDestroyElement', function() {
        this._selectize.destroy();
    }),
});
