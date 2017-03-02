'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Autocomplete Search component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               **/


var Search = function (_Component) {
  _inherits(Search, _Component);

  _createClass(Search, null, [{
    key: 'defaultProps',
    get: function get() {
      return {
        initialSelected: [],
        placeholder: '— None',
        NotFoundPlaceholder: 'Please search for some items...',
        maxSelected: 100,
        multiple: false,
        filterSearchItems: false,
        fixedMenu: false
      };
    }
  }, {
    key: 'propTypes',
    get: function get() {
      return {
        items: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
        initialSelected: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object)]),
        onItemsChanged: _react2.default.PropTypes.func,
        placeholder: _react2.default.PropTypes.string,
        NotFoundPlaceholder: _react2.default.PropTypes.string,
        maxSelected: _react2.default.PropTypes.number,
        multiple: _react2.default.PropTypes.bool,
        filterSearchItems: _react2.default.PropTypes.bool,
        fixedMenu: _react2.default.PropTypes.bool,
        onKeyChange: _react2.default.PropTypes.func,
        getItemsAsync: _react2.default.PropTypes.func
      };
    }
  }]);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.state = {
      menuItems: [],
      selectedItems: [],
      searchValue: '',
      menuVisible: false
    };
    return _this;
  }

  _createClass(Search, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          initialSelected = _props.initialSelected,
          fixedMenu = _props.fixedMenu;

      if (initialSelected instanceof Array) {
        this.setSelected(initialSelected);
      } else {
        this.addSelected(initialSelected);
      }
      if (fixedMenu) this.showMenu();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.blurTimeout);
    }
  }, {
    key: 'SearchItemInArrayObjects',
    value: function SearchItemInArrayObjects(items, input, searchKey) {
      var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ''), 'i');
      return items.filter(function (item) {
        if (reg.test(item[searchKey])) {
          return item;
        }
      });
    }
  }, {
    key: 'selectMenuItem',
    value: function selectMenuItem(item) {
      var _props2 = this.props,
          multiple = _props2.multiple,
          fixedMenu = _props2.fixedMenu;

      multiple ? this.addSelected(item) : this.setSelected([item]);
      if (!fixedMenu) this.hideMenu();
    }
  }, {
    key: 'showMenu',
    value: function showMenu() {
      this.setState({ menuVisible: true });
    }
  }, {
    key: 'hideMenu',
    value: function hideMenu() {
      this.setState({ menuVisible: false });
      this.resetPlaceholder();
    }
  }, {
    key: 'triggerItemsChanged',
    value: function triggerItemsChanged() {
      if (this.props.onItemsChanged !== undefined) {
        this.props.onItemsChanged(this.state.selectedItems);
      }
    }
  }, {
    key: 'triggerKeyChange',
    value: function triggerKeyChange(searchValue) {
      if (this.props.onKeyChange !== undefined) {
        this.props.onKeyChange(searchValue);
      }
    }
  }, {
    key: 'triggerGetItemsAsync',
    value: function triggerGetItemsAsync(searchValue) {
      var _this2 = this;

      if (this.props.getItemsAsync !== undefined) {
        this.props.getItemsAsync(searchValue, function () {
          _this2.updateSearchValue(searchValue);
        });
      }
    }
  }, {
    key: 'setSelected',
    value: function setSelected(selected) {
      var _this3 = this;

      this.setState({ selectedItems: selected }, function () {
        _this3.triggerItemsChanged();
      });
    }
  }, {
    key: 'addSelected',
    value: function addSelected(selected) {
      var _this4 = this;

      var items = this.state.selectedItems;
      items.push(selected);
      this.setState({ selectedItems: items }, function () {
        _this4.triggerItemsChanged();
      });
    }
  }, {
    key: 'removeSelected',
    value: function removeSelected(itemId) {
      var _this5 = this;

      var items = this.state.selectedItems;
      var itemsUpdated = items.filter(function (i) {
        return i.id != itemId;
      });
      this.setState({ selectedItems: itemsUpdated }, function () {
        _this5.triggerItemsChanged();
      });
    }
  }, {
    key: 'updateSearchValue',
    value: function updateSearchValue(value) {
      var _this6 = this;

      var _props3 = this.props,
          items = _props3.items,
          filterSearchItems = _props3.filterSearchItems;

      this.setState({ searchValue: value }, function () {
        if (value) {
          var menuItems = filterSearchItems ? _this6.SearchItemInArrayObjects(items, _this6.state.searchValue, 'value') : items;
          _this6.setMenuItems(menuItems);
        } else {
          _this6.setMenuItems([]);
        }
      });
    }
  }, {
    key: 'showAllMenuItems',
    value: function showAllMenuItems() {
      if (this.state.searchValue) {
        var _props4 = this.props,
            items = _props4.items,
            filterSearchItems = _props4.filterSearchItems;

        var menuItems = filterSearchItems ? this.SearchItemInArrayObjects(items, this.state.searchValue, 'value') : items;
        this.setMenuItems(menuItems);
      } else {
        this.setMenuItems([]);
      }
    }
  }, {
    key: 'setMenuItems',
    value: function setMenuItems(items) {
      var _props5 = this.props,
          getItemsAsync = _props5.getItemsAsync,
          fixedMenu = _props5.fixedMenu;

      this.setState({ menuItems: items });
      if (items.length || getItemsAsync != undefined) {
        this.showMenu();
      } else if (!fixedMenu) {
        this.hideMenu();
      }
    }
  }, {
    key: 'itemSelected',
    value: function itemSelected(itemId) {
      var selectedItems = this.state.selectedItems;

      var item = selectedItems.find(function (s) {
        return s.id === itemId;
      });
      return item != undefined;
    }
  }, {
    key: 'focusInput',
    value: function focusInput(e) {
      var _this7 = this;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.showAllMenuItems();
      _reactDom2.default.findDOMNode(this.refs.searchInput).placeholder = '';
      this.blurTimeout = setTimeout(function () {
        _reactDom2.default.findDOMNode(_this7.refs.searchInput).focus();
      }, 500);
    }
  }, {
    key: 'blurInput',
    value: function blurInput() {
      var _this8 = this;

      var _props6 = this.props,
          multiple = _props6.multiple,
          fixedMenu = _props6.fixedMenu;

      this.blurTimeout = setTimeout(function () {
        var input = _reactDom2.default.findDOMNode(_this8.refs.searchInput);
        if (input) input.blur();
        if (!multiple || !fixedMenu) {
          _this8.hideMenu();
        }
      }, 500);
    }
  }, {
    key: 'resetPlaceholder',
    value: function resetPlaceholder() {
      var placeholder = _reactDom2.default.findDOMNode(this.refs.placeholder);
      placeholder = this.props.placeholder;
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(e) {
      e.preventDefault();
      e.stopPropagation();
      this.removeSelected(e.target.dataset.id);
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus(e) {
      this.focusInput();
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      this.focusInput();
    }
  }, {
    key: 'handleItemClick',
    value: function handleItemClick(e) {
      this.focusInput(e);
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(e) {
      var element = e.currentTarget.children[0];
      var item = { id: parseInt(element.dataset.id), value: element.innerHTML.replace(/&amp;/g, '&') };
      this.selectMenuItem(item);
    }
  }, {
    key: 'handleKeyChange',
    value: function handleKeyChange(e) {
      var getItemsAsync = this.props.getItemsAsync;

      var newValue = this.refs.searchInput.value;
      var oldValue = this.state.searchValue;
      if (newValue) {
        if (newValue !== oldValue) {
          this.triggerKeyChange(newValue);
          if (getItemsAsync != undefined) {
            this.triggerGetItemsAsync(newValue);
          } else {
            this.updateSearchValue(newValue);
          }
        }
      } else {
        this.updateSearchValue(newValue);
      }
    }
  }, {
    key: 'handleInputClear',
    value: function handleInputClear(e) {
      _reactDom2.default.findDOMNode(this.refs.searchInput).value = '';
      this.updateSearchValue('');
      this.focusInput(e);
    }
  }, {
    key: 'renderMenuItems',
    value: function renderMenuItems() {
      var _this9 = this;

      var _state = this.state,
          menuItems = _state.menuItems,
          selectedItems = _state.selectedItems;
      var _props7 = this.props,
          NotFoundPlaceholder = _props7.NotFoundPlaceholder,
          fixedMenu = _props7.fixedMenu;

      if (!menuItems.length && !fixedMenu) {
        return null;
      }

      var items = menuItems.map(function (item, i) {
        if (_this9.itemSelected(item.id)) {
          return _react2.default.createElement(
            'li',
            { key: i, className: 'autocomplete__item autocomplete__item--disabled' },
            _react2.default.createElement('span', { key: i, 'data-id': item.id, dangerouslySetInnerHTML: { __html: item.value } })
          );
        } else {
          return _react2.default.createElement(
            'li',
            { key: i, className: 'autocomplete__item', onClick: _this9.handleSelect.bind(_this9) },
            _react2.default.createElement('span', { key: i, 'data-id': item.id, dangerouslySetInnerHTML: { __html: item.value } })
          );
        }
      });
      return items;
    }
  }, {
    key: 'renderSelectedItems',
    value: function renderSelectedItems() {
      var _this10 = this;

      var selectedItems = this.state.selectedItems;
      var _props8 = this.props,
          multiple = _props8.multiple,
          placeholder = _props8.placeholder;

      if (!selectedItems.length && multiple) return;

      if (!multiple) {
        return _react2.default.createElement(
          'li',
          { className: 'autocomplete__item autocomplete__item--selected autocomplete__item__dropdown',
            onClick: this.handleItemClick.bind(this) },
          _react2.default.createElement('span', { className: 'autocomplete__placeholder', dangerouslySetInnerHTML: { __html: placeholder } }),
          _react2.default.createElement('span', { className: 'autocomplete__dropdown' })
        );
      }

      var items = selectedItems.map(function (item, i) {
        var itemClass = 'autocomplete__item autocomplete__item--selected autocomplete__item__dropdown';
        var dropDown = _react2.default.createElement('span', { className: 'autocomplete__dropdown' });

        if (multiple) {
          dropDown = null;
          itemClass = 'autocomplete__item autocomplete__item--selected';
        }

        return _react2.default.createElement(
          'li',
          { key: i, 'data-id': item.id, className: itemClass, onClick: _this10.handleRemove.bind(_this10) },
          _react2.default.createElement('span', { className: 'autocomplete__item__value', 'data-id': item.id, dangerouslySetInnerHTML: { __html: item.value } }),
          dropDown
        );
      });
      return items;
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _props9 = this.props,
          maxSelected = _props9.maxSelected,
          multiple = _props9.multiple;
      var _state2 = this.state,
          menuVisible = _state2.menuVisible,
          searchValue = _state2.searchValue,
          selectedItems = _state2.selectedItems;

      var inputClass = 'autocomplete__input';
      if (multiple && selectedItems.length >= maxSelected) {
        inputClass = 'autocomplete__input autocomplete__input--hidden';
      }
      var inputClearClass = 'autocomplete__input__clear';
      if (searchValue === '' || multiple && selectedItems.length >= maxSelected) {
        inputClearClass = 'autocomplete__input__clear autocomplete__input__clear--hidden';
      }
      var inputWrapClass = 'autocomplete__input--wrap';
      if (menuVisible) {
        inputWrapClass = 'autocomplete__input--wrap autocomplete__input--wrap--active';
      }

      return _react2.default.createElement(
        'div',
        { className: inputWrapClass },
        _react2.default.createElement('input', { type: 'text',
          className: inputClass,
          ref: 'searchInput',
          placeholder: this.props.placeholder,
          onClick: this.handleClick.bind(this),
          onFocus: this.handleFocus.bind(this),
          onKeyUp: this.handleKeyChange.bind(this) }),
        _react2.default.createElement('span', { className: inputClearClass,
          onClick: this.handleInputClear.bind(this) })
      );
    }
  }, {
    key: 'getMenuClass',
    value: function getMenuClass() {
      var _props10 = this.props,
          maxSelected = _props10.maxSelected,
          multiple = _props10.multiple;
      var _state3 = this.state,
          menuVisible = _state3.menuVisible,
          selectedItems = _state3.selectedItems;

      var menuClass = 'autocomplete__menu autocomplete__menu--hidden';
      if (menuVisible && !multiple) {
        menuClass = 'autocomplete__menu';
      }
      if (menuVisible && selectedItems.length < maxSelected) {
        menuClass = 'autocomplete__menu';
      }
      return menuClass;
    }
  }, {
    key: 'render',
    value: function render() {
      var multiple = this.props.multiple;

      var menuClass = this.getMenuClass();

      return _react2.default.createElement(
        'div',
        { className: 'autocomplete' },
        _react2.default.createElement(
          'div',
          { className: 'autocomplete__selected' },
          _react2.default.createElement(
            'ul',
            { className: 'autocomplete__items' },
            this.renderSelectedItems()
          )
        ),
        this.renderInput(),
        _react2.default.createElement(
          'div',
          { className: 'autocomplete__menu--wrap' },
          _react2.default.createElement(
            'div',
            { className: menuClass, ref: 'autocomplete' },
            _react2.default.createElement('span', { className: 'autocomplete__close',
              onClick: this.hideMenu.bind(this) }),
            _react2.default.createElement(
              'ul',
              { className: 'autocomplete__items' },
              this.renderMenuItems()
            )
          )
        )
      );
    }
  }]);

  return Search;
}(_react.Component);

exports.default = Search;