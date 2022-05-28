import React, {useRef, useState} from 'react';
import {marked} from "marked";
import Prism from "prismjs";
import './style.css'

marked.setOptions({
    breaks: true, highlight: function (code) {
        return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
});

// INSERTS target="_blank" INTO HREF TAGS (required for Codepen links)
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
    return `<a target="_blank" href="${href}">${text}</a>`;
};



const App = () => {
    const [markdown, setMarkdown] = useState(placeholder)
    const [scrollTop, setScrollTop] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [readerMode, setReaderMode] = useState(false)

    function onScroll(event) {
        setScrollTop(event.target.scrollTop)
    }

    function onToggleEditMode() {
        setEditMode(!editMode)
        setReaderMode(false)
        console.log('editMode = ' + editMode + '; readerMode = ' + readerMode)
    }

    function onToggleReaderMode() {
        setReaderMode(!readerMode)
        setEditMode(false)
        console.log('editMode = ' + editMode + '; readerMode = ' + readerMode)
    }

    function onSaveAsHTML(){
        const content = marked(markdown);
        const fileName = "export.html";

        if (navigator.msSaveBlob) { // IE
            navigator.msSaveBlob(new Blob([content], { type: 'text/html;charset=utf-8;' }), fileName);
        } else {
            const a = document.createElement('a');
            a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(content);
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    function onOpenFromDisk(){
        const input = document.body.appendChild(
            document.createElement("input")
        );
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".md, .txt");

        input.addEventListener("change", ({ target }) => {
            if (target.files && target.files[0]) {
                const fileReader = new FileReader();
                fileReader.onload = event => {
                    setMarkdown(event.target.result);
                    document.body.removeChild(input);
                }
                fileReader.readAsText(target.files[0]);
            }
        });
        input.click();
    }

    return (
        <div className="wrapper">
            <Navbar
                editMode={editMode}
                readerMode={readerMode}
                onToggleEditMode={onToggleEditMode}
                onToggleReaderMode={onToggleReaderMode}
                onSaveAsHTML={onSaveAsHTML}
                onOpenFromDisk={onOpenFromDisk}
            />
            <Editor
                markdown={markdown}
                onChange={setMarkdown}
                scrollTop={scrollTop}
                onScroll={onScroll}
                editMode={editMode}
                readerMode={readerMode}
            />
            <Preview
                markdown={markdown}
                scrollTop={scrollTop}
                onScroll={onScroll}
                editMode={editMode}
                readerMode={readerMode}
            />
        </div>);
};


const Editor = (props) => {
    const editorRef = useRef();
    if (typeof editorRef.current !== 'undefined' ) {
        editorRef.current.scrollTop = props.scrollTop
    }

    return (
        <div
            className={"editor"
                + (props.readerMode ? " hide" : '')
                + (props.editMode ? " center" : '')
        }
        >
        <textarea
            ref={editorRef}
            id="editor"
            className="editor-textarea"
            value={props.markdown}
            onChange={event => props.onChange(event.target.value)}
            onScroll={event => props.onScroll(event)}
        />
        </div>);
};

const Preview = (props) => {
    const previewRef = useRef()
    if (typeof previewRef.current !== 'undefined' ) {
        previewRef.current.scrollTop = props.scrollTop
    }

    return (<div
        className={"previewer"
            + (props.editMode ? " hide" : '')
            + (props.readerMode ? " center" : '')
    }
    >
        <div
            ref={previewRef}
            id="previewer"
            className="previewer-content"
            onScroll={event => props.onScroll(event)}  // ???
            dangerouslySetInnerHTML={{
                __html: marked(props.markdown)
            }}
        />
    </div>);
};


const Navbar = (props) => {
    const editModeClassName = "fas fa-pencil-alt navbar-wrapper-icon" + (props.editMode ? " choosen" : "");
    const readerModeClassName = "fas fa-eye navbar-wrapper-icon" + (props.readerMode ? " choosen" : "");
    const saveAsHTMLClassName = "fas fa-download navbar-wrapper-icon";
    const openFromDiskClassName = "fas fa-upload navbar-wrapper-icon";
    return (
        <nav className="navbar">
            <div className="nav-wrapper">
                <h1>Markdown Previewer</h1>
            </div>
            <div className="nav-wrapper">
                <i className={editModeClassName} onClick={event => props.onToggleEditMode(event)}></i>
                <i className={readerModeClassName} onClick={event => props.onToggleReaderMode(event)}></i>
                <i className={saveAsHTMLClassName} onClick={event => props.onSaveAsHTML(event)}></i>
                <i className={openFromDiskClassName} onClick={event => props.onOpenFromDisk(event)}></i>
            </div>
        </nav>
    );
};


const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

export default App;
