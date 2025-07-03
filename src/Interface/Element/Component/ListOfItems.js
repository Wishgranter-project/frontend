import CustomElement from '../CustomElement';
import PlaylistItem  from './PlaylistItem';

/**
 * Contains a series of list of playlist elements.
 *
 * And govern how they interact with each other and the parent element.
 *
 * @class
 */
class ListOfItems extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'list-of-items';

    /**
     * Constructor.
     *
     * @param {Array} descriptions
     * List of playlist items.
     */
    __construct(descriptions = [])
    {
        super.__construct();
        this.descriptions = descriptions;
        this.selectionStart = null;
        this.draggingElement = null;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.$refs.list = this.createAndAttach('ol');
        this.classList.add(ListOfItems.elementName);

        for (var item of this.descriptions) {
            if (!item) {
                console.error('falsy item');
                continue;
            }
            this.addElement(item);
        }

        this.addEventListenerOnce('mousedown', 'mousedown', this.onMouseDown.bind(this));
        this.addEventListenerOnce('mouseup', 'mouseup', this.onMouseUp.bind(this));
        this.addEventListenerOnce('dragstart', 'dragstart', this.onDragStart.bind(this));
        this.addEventListenerOnce('dragend', 'dragend', this.onDragEnd.bind(this));
        this.addEventListenerOnce('item-add-to-collection', 'item:intention:add-to-collection', this.onAddToCollection.bind(this));

        if (this.getAttribute('reordable') == 'true') {
            this.addEventListenerOnce('dragover', 'dragover', this.onDragOver.bind(this));
            this.addEventListenerOnce('drop', 'drop', this.onDrop.bind(this));
        }
    }

    /**
     * Instantiates a playlist item element and adds to the list.
     *
     * @param {Object} item
     * Description of a playlist item.
     *
     * @returns {HTMLElement}
     * <li> element.
     */
    addElement(item)
    {
        var li = this.$refs.list.createAndAttach('li', {draggable: 'true'}, PlaylistItem.instantiate(item));
        return li;
    }

    /**
     * Listens for the dragstart event.
     *
     * @listens dragstart
     *
     * @param {Event} evt
     * Drag start event.
     */
    onDragStart(evt)
    {
        this.draggingElement = evt.target;
        var json = JSON.stringify(this.getSelectedItems());
        evt.dataTransfer.setData('text/plain', json);
    }

    /**
     * Listens for the dragend event.
     *
     * @listens dragend
     *
     * @param {Event} evt
     * Dragend event.
     */
    onDragEnd(evt)
    {
        //this.draggingElement = null;
    }

    /**
     * Listens for the event that opens the playlist modal selector.
     * 
     * @listens item:intention:add-to-collection
     *
     * @param {Event} evt
     * Drag end event.
     */    
    onAddToCollection(evt)
    {
        evt.detail.items = evt.detail.items.concat(this.getSelectedItems());
    }

    /**
     * Listens for the mouse down event.
     *
     * @listens mousedown
     *
     * @param {Event} evt
     * Mouse down event.
     */
    onMouseDown(evt)
    {
        if (evt.which !== 1) {
            return;
        }

        var li = evt.target.getAncestor('li');
        if (!li) {
            return;
        }

        var liIndex = li.index();

        if (this.getSelectedElements().length && evt.shiftKey == false && evt.ctrlKey == false && this.isElementSelected(li)) {
            // Let onMouseUp handle it.
            return;
        }
        
        if (!evt.ctrlKey) {
            this.deselectAllElements();
        }

        if (this.selectionStart === null || evt.shiftKey == false) {
            this.selectionStart = liIndex;
        }

        if (evt.ctrlKey) {
            this.isElementSelected(li)
                ? this.deselectElement(li)
                : this.selectElement(li);
        } else {
            this.selectElement(li);

            if (evt.shiftKey) {
                this.selectRange(this.selectionStart, liIndex);
            }
        }
    }

    /**
     * Listens for the mouse up event.
     *
     * @listens mouseup
     *
     * @param {Event} evt
     * Mouse up event.
     */
    onMouseUp(evt)
    {
        if (evt.which !== 1) {
            return;
        }

        var li = evt.target.getAncestor('li');
        if (!li) {
            return;
        }

        var liIndex = li.index();

        if (evt.shiftKey == false && evt.ctrlKey == false) {
            this.deselectAllElements();
            this.selectElement(li);
            this.selectionStart = liIndex;
        }
    }

    //-----REORDABLE------------------------

    /**
     * Listens for the dragover event.
     *
     * @listens dragover
     *
     * @param {Event} evt
     * Drag over event.
     */
    onDragOver(evt)
    {
        evt.preventDefault();
    }

    /**
     * Listens for the drop event.
     *
     * @listens drop
     *
     * @param {Event} evt
     * Drop event.
     */
    onDrop(evt)
    {
        if (!this.dropIsValid(evt)) {
            return;
        }

        this.draggingElement
            ? this.onDropLocal(evt)
            : this.onDropForeign(evt);
    }

    /**
     * Reacts to the user dropping a child element.
     *
     * @param {Event} evt
     * Drop event.
     */
    onDropLocal(evt)
    {
        var droppedOnLi      = evt.target.getAncestor('li');
        var selectedElements = this.getSelectedElements();

        var oldIndexes = this.extractIndexes(selectedElements);
        droppedOnLi.before(...selectedElements);
        selectedElements = this.getSelectedElements();
        var newIndexes = this.extractIndexes(selectedElements);
        var changes = [];

        for (var n in newIndexes) {
            if (oldIndexes[n] == newIndexes[n]) {
                continue;
            }

            changes.push({
                from: oldIndexes[n],
                item: selectedElements[n].firstChild.item,
                to: newIndexes[n]
            });
        }

        this.fireEvent('list-of-items:reordered', {changes});
    }

    /**
     * Checks if we are good to handle the element being dropped.
     *
     * @param {Event} dropEvt
     * Drop event.
     *
     * @returns {Bool}
     * Returns true if it is valid.
     */
    dropIsValid(dropEvt)
    {
        return true;
    }

    /**
     * Reacts to the user dropping an element from outside.
     *
     * @param {Event} evt
     * Drop event.
     */
    onDropForeign(evt)
    {
        // to be implemented
    }

    //---------------------------------------------

    /**
     * Marks an element as selected.
     *
     * @param {HTMLElement} element
     * List item.
     */
    selectElement(element)
    {
        element.classList.add('selected');
    }

    /**
     * Marks an element as no longer selected.
     *
     * @param {HTMLElement} element
     * List item.
     */
    deselectElement(element)
    {
        element.classList.remove('selected');
    }

    /**
     * Checks if an element is selected.
     *
     * @param {HTMLElement} element
     * List item.
     *
     * @returns {Bool}
     * Returns true if it is selected.
     */
    isElementSelected(element)
    {
        return element.classList.contains('selected');
    }

    /**
     * Selects a list element by its index.
     *
     * @param {Integer} index
     * The index of the element.
     */
    select(index)
    {
        var n = index + 1;
        this.selectElement(this.querySelector(`li:nth-child(${n})`));
    }

    /**
     * Selects a range of items.
     *
     * @param {Integer} indexStart
     * Beggining.
     * @param {Integer} indexEnd
     * End.
     */
    selectRange(indexStart, indexEnd)
    {
        var begin, end;
        if (indexEnd > indexStart) {
            begin = indexStart;
            end = indexEnd;
        } else {
            begin = indexEnd;
            end = indexStart;
        }

        for (var n = begin; n <= end; n++) {
            this.select(n);
        }
    }

    /**
     * Deselects all elements.
     */
    deselectAllElements()
    {
        this.querySelectorAll('li.selected').forEach((el) =>
        {
            this.deselectElement(el);
        });
    }

    /**
     * Returns the selected elements.
     *
     * @returns {NodeList}
     * List of selected elements.
     */
    getSelectedElements()
    {
        return this.querySelectorAll('li.selected');
    }

    /**
     * Returns a list of the selected playlist items.
     *
     * @returns {Array}
     * Array of playlist item objects.
     */
    getSelectedItems()
    {
        return this.extractItems(this.getSelectedElements());
    }

    /**
     * Returns all the playlist items.
     *
     * @returns {Array}
     * Array of playlist item objects.
     */
    getItems()
    {
        return this.extractItems(this.getElements());
    }

    /**
     * Returns all the <li> elements.
     *
     * @returns {NodeList}
     * List of <li> elements.
     */
    getElements()
    {
        return this.querySelectorAll('li');
    }

    /**
     * Extracts playlist items from html elements.
     *
     * @param {NodeList} nodeList
     * List of nodes.
     *
     * @returns {Array}
     * List of playlist items
     */
    extractItems(nodeList)
    {
        var items = [];
        nodeList.forEach((el) =>
        {
            items.push(el.querySelector(PlaylistItem.elementName).item);
        }); 

        return items;
    }

    /**
     * Extracts the node index of node list.
     *
     * @param {NodeList} nodeList
     * List of nodes.
     *
     * @returns {Array}
     * List of integers.
     */
    extractIndexes(nodeList)
    {
        var indexes = [];
        nodeList.forEach((el) =>
        {
            indexes.push(el.index());
        });

        return indexes;
    }

    /**
     * Sets the playlist items to be displayed.
     *
     * @param {Array} descriptions
     * Playlist items.
     */
    setItems(descriptions)
    {
        this.descriptions = descriptions;
        if (!this.attached) {
            return;
        }

        var previouslySelectedItems = this.getSelectedItems();
        this.refresh();

        if (!previouslySelectedItems.length) {
            return;
        }

        // Select them back.
        // @todo Need to find a better way of doing this bullshit.
        setTimeout(() => {
            for (var li of this.$refs.list.children) {
                if (previouslySelectedItems.includes(li.firstChild.item)) {
                    this.selectElement(li);
                }
            }
        }, 100);
    }
}

ListOfItems.register();

export default ListOfItems;
