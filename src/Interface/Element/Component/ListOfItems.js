import CustomElement from '../CustomElement';
import PlaylistItem  from './PlaylistItem';

class ListOfItems extends CustomElement 
{
    static elementName = 'list-of-items';

    __construct(items = []) 
    {
        this.items = items;
        this.selectionStart = null;
    }

    render() 
    {
        this.$refs.list = this.createAndAttach('ol');
        this.classList.add('list-of-items');

        for (var item of this.items) {
            this.addElement(item);
        }

        this.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.addEventListener('dragstart', this.onDragStart.bind(this));

        // this.addEventListener('dragstart', (evt) => 
        // {
        //     evt.stopPropagation();
        // });

        this.addEventListener('item:intention:add-to-collection', this.onAddToCollection.bind(this)) ;
    }

    onDragStart(evt)
    {
        var json = JSON.stringify(this.getSelectedItems());
        evt.dataTransfer.setData('text/plain', json);
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

        if (this.getSelectedElements().length && evt.shiftKey == false && this.isElementSelected(li)) {
            // Let onMouseUp handle it.
            return;
        }
        
        if (!evt.ctrlKey) {
            this.deselectAllElements();
        }

        if (this.selectionStart === null || evt.shiftKey == false) {
            this.selectionStart = liIndex;
        }

        this.selectElement(li);

        if (evt.shiftKey) {
            this.selectRange(this.selectionStart, liIndex);
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

        if (evt.shiftKey == false) {
            if (evt.ctrlKey == false) {
                this.deselectAllElements();
            }
            this.selectElement(li);
            this.selectionStart = liIndex;
        }
    }

    selectElement(element)
    {
        element.classList.add('selected');
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
            el.classList.remove('selected');
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
}

ListOfItems.register();

export default ListOfItems;
