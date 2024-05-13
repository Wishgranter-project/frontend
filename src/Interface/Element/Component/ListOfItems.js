import CustomElement from '../CustomElement';
import PlaylistItem  from './PlaylistItem';

class ListOfItems extends CustomElement 
{
    static elementName = 'list-of-items';

    __construct(items = []) 
    {
        this.items = items;
        this.selectionStart = null;
        this.draggingElement = null;
    }

    render() 
    {
        this.$refs.list = this.createAndAttach('ol');

        this.classList.add('list-of-items');

        for (var item of this.items) {
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

    onDragStart(evt)
    {
        this.draggingElement = evt.target;
        var json = JSON.stringify(this.getSelectedItems());
        evt.dataTransfer.setData('text/plain', json);
    }

    onDragEnd(evt)
    {
        //this.draggingElement = null;
    }

    onAddToCollection(evt)
    {
        evt.detail.items = this.getSelectedItems();
    }

    addElement(item)
    {
        var li = this.$refs.list.createAndAttach('li', {draggable: 'true'}, PlaylistItem.instantiate(item));
        return li;
    }

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

    onDragOver(evt)
    {
        evt.preventDefault();
    }

    onDrop(evt)
    {
        if (!this.dropIsValid(evt)) {
            return;
        }

        this.draggingElement
            ? this.onDropLocal(evt)
            : this.onDropForeign(evt);
    }

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

    dropIsValid(dropEvt)
    {
        return true;
    }

    onDropForeign(evt)
    {
        // to be implemented
    }

    //---------------------------------------------

    selectElement(element)
    {
        element.classList.add('selected');
    }

    deselectElement(element)
    {
        element.classList.remove('selected');
    }

    isElementSelected(element)
    {
        return element.classList.contains('selected');
    }

    select(index)
    {
        var n = index + 1;
        this.selectElement(this.querySelector(`li:nth-child(${n})`));
    }

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

    deselectAllElements()
    {
        this.querySelectorAll('li.selected').forEach((el) =>
        {
            this.deselectElement(el);
        });
    }

    getSelectedItems()
    {
        return this.extractItems(this.getSelectedElements());
    }

    getSelectedElements()
    {
        return this.querySelectorAll('li.selected');
    }

    getItems()
    {
        return this.extractItems(this.getElements());
    }

    getElements()
    {
        return this.querySelectorAll('li');
    }

    extractItems(nodeList)
    {
        var items = [];
        nodeList.forEach((el) =>
        {
            items.push(el.querySelector(PlaylistItem.elementName).item);
        }); 

        return items;
    }

    extractIndexes(nodeList)
    {
        var indexes = [];
        nodeList.forEach((el) =>
        {
            indexes.push(el.index());
        });

        return indexes;
    }

    setItems(items)
    {
        this.items = items;
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
        setTimeout(()=>{
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
