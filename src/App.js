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

    function onScroll(event) {
        setScrollTop(event.target.scrollTop)
    }

    return (
        <div className="wrapper">
            <Editor
                markdown={markdown}
                onChange={setMarkdown}
                scrollTop={scrollTop}
                onScroll={onScroll}
            />
            <Preview
                markdown={markdown}
                scrollTop={scrollTop}
                onScroll={onScroll}
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
            className="editor">
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
        className="previewer">
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
