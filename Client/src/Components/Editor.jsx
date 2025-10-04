import React, { useEffect, useRef, useState } from "react";
import { materialDark } from '@fsegurai/codemirror-theme-material-dark';
import { GrPowerReset } from "react-icons/gr";
import { FaCopy } from "react-icons/fa6";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/material-darker.css"; // material theme CSS

import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/closebrackets.js";
import "./Editor.css";
import ACTIONS from "../actions";
import Output from "./Output";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const [language,setLanguage] = useState(50);
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const [codehere, setCode] = useState("");

  useEffect(() => {
    // Initialize CodeMirror only once
    if (textareaRef.current && !editorRef.current) {
      editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
        mode: { name: "javascript", json: true },
        theme: "material-darker",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      // Listen for changes in the editor
      editorRef.current.on("change", (instance, change) => {
        const { origin } = change;
        const code = instance.getValue();
        setCode(code);
        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (editorRef.current && code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="component-container">
      <div className="navbar">
        <select id="language" name="language" 
        onChange={(ele)=>{
            const lang = ele.target.value;
            const langcode = parseInt(lang, 10);
            setLanguage(langcode);
        }}>
          <option value="50">C (11.1.0)</option>
          <option value="54">C++ (11.1.0)</option>
          <option value="62">Java (17.0.1)</option>
          <option value="71">Python (3.10.0)</option>
          <option value="63">JavaScript (16.9.0)</option>
          <option value="74">TypeScript (4.4.3)</option>
          <option value="51">C# (Mono 6.12.0)</option>
          <option value="60">Go (1.17.2)</option>
          <option value="78">Kotlin (1.5.31)</option>
          <option value="83">Swift (5.5)</option>
          <option value="68">PHP (8.0.10)</option>
          <option value="72">Ruby (3.0.2)</option>
          <option value="73">Rust (1.56.1)</option>
          <option value="80">R (4.1.1)</option>
          <option value="81">Scala (3.0.2)</option>
          <option value="82">SQL (3.31.1)</option>
          <option value="85">Dart (2.14.4)</option>
          <option value="64">Lua (5.4.3)</option>
          <option value="46">Bash (5.1.8)</option>
          <option value="45">Assembly (NASM 2.15.05)</option>
          <option value="61">Haskell (9.0.1)</option>
        </select>
        <div className="settings">
            <button className="navbutton">
            <FaCopy size={20}/>
        </button>
        <button className="navbutton">
            <GrPowerReset size={20} />
        </button>
        </div>
        
      </div>

      <textarea ref={textareaRef} id="realTimeCodeEditor"></textarea>

      <Output code={codehere} languageId={language} />
    </div>
  );
};

export default Editor;
