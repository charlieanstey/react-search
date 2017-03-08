/**
 * Autocomplete Search component
**/
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class Search extends Component {

  static get defaultProps () {
    return {
      initialSelected: [],
      placeholder: '— None',
      NotFoundPlaceholder: 'Please search for some items...',
      maxSelected: 100,
      multiple: false,
      filterSearchItems: false,
      fixedMenu: false
    }
  }

  static get propTypes () {
    return {
      items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      initialSelected: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.arrayOf(React.PropTypes.object)
      ]),
      onItemsChanged: React.PropTypes.func,
      placeholder: React.PropTypes.string,
      NotFoundPlaceholder: React.PropTypes.string,
      maxSelected: React.PropTypes.number,
      multiple: React.PropTypes.bool,
      filterSearchItems: React.PropTypes.bool,
      fixedMenu: React.PropTypes.bool,
      onKeyChange: React.PropTypes.func,
      getItemsAsync: React.PropTypes.func,
      onFocus: React.PropTypes.func
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      menuItems: [],
      selectedItems: [],
      searchValue: '',
      menuVisible: false
    }
  }

  componentDidMount() {
    const { initialSelected, fixedMenu } = this.props;
    if(initialSelected instanceof Array) {
      this.setSelected(initialSelected)
    } else {
      this.addSelected(initialSelected)
    }
    if (fixedMenu) this.showMenu()
  }

  componentWillUnmount() {
    clearTimeout(this.blurTimeout)
  }

  SearchItemInArrayObjects(items, input, searchKey) {
    var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ''), 'i')
    return items.filter((item) => {
      if (reg.test(item[searchKey])) {
        return item
      }
    })
  }

  selectMenuItem (item) {
    const { multiple, fixedMenu } = this.props;
    multiple ? this.addSelected(item) : this.setSelected( [item] )
    if (!fixedMenu) this.hideMenu()
  }

  showMenu() {
    this.setState({menuVisible: true }, () => {
      this.triggerIsActiveChange()
    })
  }

  hideMenu() {
    this.setState({menuVisible: false }, () => {
      this.triggerIsActiveChange()
    })
    this.resetPlaceholder()
  }
  
  triggerIsActiveChange() {
    if (this.props.onFocus !== undefined) {
      let isActive = this.state.menuVisible
      this.props.onFocus(isActive)
    }
  }

  triggerItemsChanged() {
    if (this.props.onItemsChanged !== undefined) {
      this.props.onItemsChanged(this.state.selectedItems)
    }
  }

  triggerKeyChange(searchValue) {
    if (this.props.onKeyChange !== undefined) {
      this.props.onKeyChange(searchValue)
    }
  }

  triggerGetItemsAsync(searchValue) {
    if (this.props.getItemsAsync !== undefined) {
      this.props.getItemsAsync(searchValue, () => {
        this.updateSearchValue(searchValue)
      })
    }
  }

  setSelected(selected) {
    this.setState({selectedItems: selected }, () => {
      this.triggerItemsChanged()
    })
  }

  addSelected(selected) {
    let items = this.state.selectedItems
    items.push(selected)
    this.setState({selectedItems: items }, () => {
      this.triggerItemsChanged()
    })
  }

  removeSelected(itemId) {
    let items = this.state.selectedItems
    let itemsUpdated = items.filter( (i) => {
	     return i.id != itemId
    })
    this.setState({selectedItems: itemsUpdated }, () => {
      this.triggerItemsChanged()
    })
  }

  updateSearchValue(value) {
    const { items, filterSearchItems } = this.props;
    this.setState({ searchValue: value }, () => {
      if (value) {
        let menuItems = filterSearchItems ? this.SearchItemInArrayObjects(items, this.state.searchValue, 'value') : items
        this.setMenuItems(menuItems)
      } else {
        this.setMenuItems([])
      }
    })
  }

  showAllMenuItems() {
    if (this.state.searchValue) {
      const { items, filterSearchItems } = this.props
      let menuItems = filterSearchItems ? this.SearchItemInArrayObjects(items, this.state.searchValue, 'value') : items
      this.setMenuItems(menuItems)
    } else {
      this.setMenuItems([])
    }
  }

  setMenuItems(items) {
    const { getItemsAsync, fixedMenu } = this.props;
    this.setState({menuItems: items})
    if(items.length || getItemsAsync != undefined){
      this.showMenu()
    } else if (!fixedMenu) {
      this.hideMenu()
    }
  }

  itemSelected(itemId) {
    const { selectedItems } = this.state;
    let item = selectedItems.find( (s) => {
        return s.id === itemId;
    });
    return (item != undefined)
  }

  focusInput(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.showAllMenuItems()
    let el = ReactDOM.findDOMNode(this.refs.searchInput)
    if (e.type === "focus") {
      setTimeout((function() {
        return () => {
          el.selectionStart = el.value.length
        }
      }(this)), 100)
    }
    this.blurTimeout = setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.searchInput).focus()
    }, 500)
  }

  blurInput() {
    const { multiple, fixedMenu } = this.props;
    this.blurTimeout = setTimeout(() => {
      let input = ReactDOM.findDOMNode(this.refs.searchInput)
      if (input) input.blur()
      if (!multiple || !fixedMenu) {
        this.hideMenu()
      }
    }, 500)
  }

  resetPlaceholder() {
    let placeholder = ReactDOM.findDOMNode(this.refs.placeholder)
    placeholder = this.props.placeholder
  }

  handleRemove(e) {
    e.preventDefault()
    e.stopPropagation()
    this.removeSelected(e.target.dataset.id)
  }

  handleFocus(e) {
    this.focusInput(e)
  }

  handleClick(e) {
    this.focusInput(e)
  }

  handleItemClick(e) {
    this.focusInput(e)
  }

  handleSelect(e) {
    let element = e.currentTarget.children[0]
    let item = { id: parseInt(element.dataset.id), value: element.innerHTML.replace(/&amp;/g, '&') }
    this.selectMenuItem(item)
  }

  handleKeyChange (e) {
    const { getItemsAsync } = this.props;
    let newValue = this.refs.searchInput.value
    let oldValue = this.state.searchValue
    if (newValue) {
      if (newValue !== oldValue) {
        this.triggerKeyChange(newValue)
        if( getItemsAsync != undefined ) {
          this.triggerGetItemsAsync(newValue)
        } else {
          this.updateSearchValue(newValue)
        }
      }
    } else {
      this.updateSearchValue(newValue)
    }
  }
  
  handleInputClear(e) {
    ReactDOM.findDOMNode(this.refs.searchInput).value = ''
    this.updateSearchValue('')
    this.focusInput(e)
  }

  renderMenuItems() {
    const { menuItems, selectedItems } = this.state;
    const { NotFoundPlaceholder, fixedMenu } = this.props;
    if(!menuItems.length && !fixedMenu) {
      return null
    }

    let items = menuItems.map((item, i) => {
      if(this.itemSelected(item.id)){
        return (
          <li key={i} className='autocomplete__item autocomplete__item--disabled'>
            <span key={i} data-id={item.id} dangerouslySetInnerHTML={{__html: item.value }}></span>
          </li>
        )
      } else {
        return (
          <li key={i} className='autocomplete__item' onClick={this.handleSelect.bind(this)}>
            <span key={i} data-id={item.id} dangerouslySetInnerHTML={{__html: item.value }}></span>
          </li>
        )
      }
    })
    return items
  }

  renderSelectedItems() {
    const { selectedItems } = this.state;
    const { multiple, placeholder } = this.props;
    if(!selectedItems.length && multiple ) return;

    if(!multiple ) {
      return (
        <li className='autocomplete__item autocomplete__item--selected autocomplete__item__dropdown'
            onClick={this.handleItemClick.bind(this)}>
          <span className="autocomplete__placeholder" dangerouslySetInnerHTML={{__html: placeholder }}></span>
          <span className='autocomplete__dropdown' />
        </li>
      )
    }

    let items = selectedItems.map((item, i) => {
      let itemClass = 'autocomplete__item autocomplete__item--selected autocomplete__item__dropdown'
      let dropDown = <span className='autocomplete__dropdown' />

      if(multiple) {
        dropDown = null
        itemClass = 'autocomplete__item autocomplete__item--selected'
      }

      return (
        <li key={i} data-id={item.id} className={itemClass} onClick={this.handleRemove.bind(this)}>
          <span className='autocomplete__item__value' data-id={item.id} dangerouslySetInnerHTML={{__html: item.value }}></span>
          { dropDown }
        </li>
      )
    })
    return items
  }

  renderInput() {
    const { maxSelected, multiple } = this.props;
    const { menuVisible, searchValue, selectedItems } = this.state;
    let inputClass = 'autocomplete__input'
    if (multiple && selectedItems.length >= maxSelected) {
      inputClass = 'autocomplete__input autocomplete__input--hidden'
    }
    let inputClearClass = 'autocomplete__input__clear'
    if (searchValue === '' || (multiple && selectedItems.length >= maxSelected)) {
      inputClearClass = 'autocomplete__input__clear autocomplete__input__clear--hidden'
    }
    let inputWrapClass = 'autocomplete__input--wrap'
    if (menuVisible) {
      inputWrapClass = 'autocomplete__input--wrap autocomplete__input--wrap--active'
    }

    return (
      <div className={inputWrapClass}>
        <input type='text'
               className={inputClass}
               ref='searchInput'
               placeholder={this.props.placeholder}
               onClick={this.handleClick.bind(this)}
               onFocus={this.handleFocus.bind(this)}
               onKeyUp={this.handleKeyChange.bind(this)} />
        <span className={inputClearClass}
              onClick={this.handleInputClear.bind(this)}></span>
      </div>
    )
  }

  getMenuClass() {
    const { maxSelected, multiple } = this.props;
    const { menuVisible, selectedItems } = this.state;
    let menuClass = 'autocomplete__menu autocomplete__menu--hidden'
    if(menuVisible && !multiple){
      menuClass = 'autocomplete__menu'
    }
    if(menuVisible && selectedItems.length < maxSelected ){
      menuClass = 'autocomplete__menu'
    }
    return menuClass
  }
  
  getMenuWrapClass() {
    const { maxSelected, multiple } = this.props;
    const { menuVisible, selectedItems } = this.state;
    let menuWrapClass = 'autocomplete__menu--wrap autocomplete__menu--wrap--hidden'
    if(menuVisible && !multiple){
      menuWrapClass = 'autocomplete__menu--wrap'
    }
    if(menuVisible && selectedItems.length < maxSelected ){
      menuWrapClass = 'autocomplete__menu--wrap'
    }
    return menuWrapClass
  }

  render () {
    const { multiple } = this.props;
    let menuWrapClass = this.getMenuWrapClass()
    let menuClass = this.getMenuClass()
    let isActive = this.state.menuVisible

    return (
      <div className={`autocomplete${isActive ? ' active' : ''}`}>

        <div className='autocomplete__selected'>
          <ul className='autocomplete__items'>
            {this.renderSelectedItems()}
          </ul>
        </div>

        { this.renderInput() }

        <div className={menuWrapClass}>
          <span className="autocomplete__close"
                onClick={this.hideMenu.bind(this)}>
          </span>
          <div className={menuClass} ref='autocomplete'>
            <ul className='autocomplete__items'>
              {this.renderMenuItems()}
            </ul>
          </div>
        </div>

      </div>
    )
  }
}
