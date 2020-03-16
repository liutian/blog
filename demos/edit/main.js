const container = document.getElementById('container');
let dropdown, preventRepeatSelectionChange = false;

container.addEventListener('mouseup', autoSelectMark);
container.addEventListener('keydown', autoSelectMark);

function autoSelectMark(e) {
  if (preventRepeatSelectionChange) {
    preventRepeatSelectionChange = false;
    return;
  }

  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  let startContainer = range.startContainer;
  let endContainer = range.endContainer;
  let startOffset = range.startOffset;
  let endOffset = range.endOffset;

  const startParentMark = startContainer.parentNode.classList.contains('mark');
  const endParentMark = endContainer.parentNode.classList.contains('mark');
  const forward = selection.anchorNode.isSameNode(startContainer) && selection.anchorOffset <= startOffset;
  let autoSelect = false;
  let keydownKey = e.type === 'keydown' ? e.key : '';

  if (e.type === 'mouseup' && (startParentMark || endParentMark)) {
    e.preventDefault();
    if (startParentMark) {
      autoSelect = true;
      const markNode = startContainer.parentNode;
      const markPreNode = markNode.previousSibling;
      const preIsTextNode = !!(markPreNode && markPreNode.nodeType === Node.TEXT_NODE);
      startOffset = preIsTextNode ? markPreNode.length :
        [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode));
      startContainer = preIsTextNode ? markPreNode : markNode.parentNode;
    }
    if (endParentMark) {
      autoSelect = true;
      const markNode = endContainer.parentNode;
      const markNextNode = markNode.nextSibling;
      const nextIsTextNode = !!(markNextNode && markNextNode.nodeType === Node.TEXT_NODE);
      endOffset = nextIsTextNode ? 0 :
        [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode)) + 1;
      endContainer = nextIsTextNode ? markNextNode : markNode.parentNode;
    }
  } else if (keydownKey !== '' && (keydownKey === 'ArrowRight' || keydownKey === 'ArrowLeft')) {
    if (e.shiftKey) {
      const endNext = endContainer.nextSibling;
      const endPre = endContainer.previousSibling;
      const startNext = startContainer.nextSibling;
      const startPre = startContainer.previousSibling;

      let nearMark = false;

      if (forward) {
        if (keydownKey === 'ArrowRight' && endContainer.nodeType === Node.TEXT_NODE && endOffset == endContainer.length) {
          nearMark = true;
        } else if (keydownKey === 'ArrowLeft' && endContainer.nodeType === Node.TEXT_NODE && endOffset === 0) {
          nearMark = true;
        }
      } else {
        if (keydownKey === 'ArrowRight' && startContainer.nodeType === Node.TEXT_NODE && startOffset == startContainer.length) {
          nearMark = true;
        } else if (keydownKey === 'ArrowLeft' && startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
          nearMark = true;
        }
      }

      if (!nearMark) {
        return;
      }

      if (forward) {
        if (keydownKey === 'ArrowRight' && endNext && endNext.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          const markNode = endNext;
          const markNextNode = markNode.nextSibling;
          const nextIsTextNode = !!(markNextNode && markNextNode.nodeType === Node.TEXT_NODE);
          endOffset = nextIsTextNode ? 0 :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode)) + 1;
          endContainer = nextIsTextNode ? markNextNode : markNode.parentNode;
        } else if (keydownKey === 'ArrowLeft' && endPre && endPre.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          const markNode = endPre;
          const markPreNode = markNode.previousSibling;
          const preIsTextNode = !!(markPreNode && markPreNode.nodeType === Node.TEXT_NODE);
          endOffset = preIsTextNode ? markPreNode.length :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode));
          endContainer = preIsTextNode ? markPreNode : markNode.parentNode;
        }
      } else {
        if (keydownKey === 'ArrowRight' && startNext && startNext.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          const markNode = startNext;
          const markNextNode = markNode.nextSibling;
          const nextIsTextNode = !!(markNextNode && markNextNode.nodeType === Node.TEXT_NODE);
          startOffset = nextIsTextNode ? 0 :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode)) + 1;
          startContainer = nextIsTextNode ? markNextNode : markNode.parentNode;
        } else if (keydownKey === 'ArrowLeft' && startPre && startPre.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          const markNode = startPre;
          const markPreNode = markNode.previousSibling;
          const preIsTextNode = !!(markPreNode && markPreNode.nodeType === Node.TEXT_NODE);
          startOffset = preIsTextNode ? markPreNode.length :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode));
          startContainer = preIsTextNode ? markPreNode : markNode.parentNode;
        }
      }
    } else if (selection.isCollapsed) {
      if (startParentMark || endParentMark) {
        e.preventDefault();
        if (keydownKey === 'ArrowRight') {
          autoSelect = true;
          const markNode = endContainer.parentNode;
          const markNextNode = markNode.nextSibling;
          const nextIsTextNode = !!(markNextNode && markNextNode.nodeType === Node.TEXT_NODE);
          endOffset = nextIsTextNode ? 1 :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode)) + 1;
          endContainer = nextIsTextNode ? markNextNode : markNode.parentNode;
          startOffset = endOffset;
          startContainer = endContainer;
        } else if (keydownKey === 'ArrowLeft') {
          autoSelect = true;
          const markNode = startContainer.parentNode;
          const markPreNode = markNode.previousSibling;
          const preIsTextNode = !!(markPreNode && markPreNode.nodeType === Node.TEXT_NODE);
          startOffset = preIsTextNode ? markPreNode.length - 1 :
            [...markNode.parentNode.childNodes].findIndex(node => node.isSameNode(markNode));
          startContainer = preIsTextNode ? markPreNode : markNode.parentNode;
          endOffset = startOffset;
          endContainer = startContainer;
        }
      } else if ((keydownKey === 'ArrowRight' && endContainer.nodeType === Node.TEXT_NODE && endOffset === endContainer.length) || (
        keydownKey === 'ArrowLeft' && startContainer.nodeType === Node.TEXT_NODE && startOffset === 1)) {

        if (keydownKey === 'ArrowRight' && endContainer.nextSibling && endContainer.nextSibling.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          startContainer = endContainer.nextSibling.firstChild;
          startOffset = 1;
          endContainer = startContainer;
          endOffset = startContainer.length - 1;
        } else if (keydownKey === 'ArrowLeft' && startContainer.previousSibling && startContainer.previousSibling.classList.contains('mark')) {
          autoSelect = true;
          e.preventDefault();
          startContainer = startContainer.previousSibling.firstChild;
          startOffset = 1;
          endContainer = startContainer;
          endOffset = startContainer.length - 1;
        }
      }
    }
  }

  if (autoSelect) {
    if (forward) {
      selection.setBaseAndExtent(startContainer, startOffset, endContainer, endOffset);
    } else {
      selection.setBaseAndExtent(endContainer, endOffset, startContainer, startOffset);
    }
  }
}


container.addEventListener('keypress', (e) => {
  if (e.key !== '"') {
    return;
  }

  const selection = document.getSelection();
  let selectionText = selection.toString().replace(/"/g, '');
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const mark = createMark(selectionText);
  range.insertNode(mark);
  range.setStart(mark.firstChild, 1);
  range.setEnd(mark.firstChild, mark.firstChild.length - 1);

  preventRepeatSelectionChange = true;
  container.normalize();
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
});


container.addEventListener('keydown', (e) => {
  setTimeout(() => {
    container.normalize();
  });
});

// container.addEventListener('keypress', (e) => {
//   if (dropdown) {
//     return;
//   }

//   const range = document.getSelection().getRangeAt(0);
//   const { x, y } = range.getBoundingClientRect();
//   dropdown = createDropdown(x - 10, y + 24);
//   document.body.appendChild(dropdown);
// });

container.addEventListener('keydown', (e) => {
  const selection = document.getSelection();
  if (e.code !== 'Backspace' || !selection.isCollapsed) {
    return;
  }

  const range = document.getSelection().getRangeAt(0);
  const currNode = selection.anchorNode;
  const preNode = currNode.previousSibling;
  if (preNode && preNode.classList.contains('mark')) {
    if (range.startOffset === 0) {
      preNode.classList.add('will-del');
      e.preventDefault();
    } else if (range.startOffset === 1) {
      preNode.classList.add('will-del');
      setTimeout(() => {
        range.selectNode(preNode);
      });
    }
  } else if (!preNode && currNode.parentNode.classList.contains('mark') && range.startOffset === 1) {
    currNode.parentNode.classList.add('will-del');
    range.selectNode(currNode.parentNode);
    e.preventDefault();
  }
});


function createDropdown(x, y) {
  const dropdown = document.createElement('div');

  dropdown.style.cssText = `
    position: fixed;
    top: ${y}px;
    left: ${x}px;
    background-color: #f5f5f5;
    width: 100px;
    height: 100px;
  `;
  return dropdown;
}

function createMark(text = '') {
  const mark = document.createElement('div');
  mark.style.display = 'inline';
  mark.className = 'mark';
  mark.textContent = `"${text}"`;
  return mark;
}