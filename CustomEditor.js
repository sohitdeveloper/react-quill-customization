import React, { useState, useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";

// import ImageUploader from "quill-image-uploader";
// Quill.register("modules/imageUploader", ImageUploader);

const CustomEditor = () => {
    const [editorHtml, setEditorHtml] = useState('');
    const reactQuillRef = useRef(null);
  
    const handleChange = (html) => {
      setEditorHtml(html);
    };
  
    const imageHandler = (e) => {
        const editor = reactQuillRef.current.getEditor();
        console.log(editor)
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
    
        input.onchange = async () => {
          const file = input.files[0];
          if (/^image\//.test(file.type)) {
            console.log(file);
            const formData = new FormData();
            formData.append("image", file);
            // const res = await ImageUpload(formData); // upload data into server or aws or cloudinary
            const url = "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=2908&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" //res?.data?.url;
            editor.insertEmbed(editor.getSelection(), "image", url);
          } else {
            ErrorToast('You could only upload images.');
          }
        };
      }

    const handleSubmit = () => {
      const editor = reactQuillRef.current.getEditor();
      setEditorHtml(editor);
    };
  
    const modules = useMemo(() => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'code-block']
        ],
        handlers: {
          image: imageHandler
        }
      }
    }), [])
    
  
    const formats = [
      'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent', 'link', 'image', 'imageBlot'
    ];

    const handleDataSubmit= () => {
    fetch('https://run.mocky.io/v3/eb70912a-d658-4d1d-b3f2-0db2683b52d6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: editorHtml,
      }),
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  }
    return (
      <>
        <ReactQuill
          ref={reactQuillRef}
          onChange={handleChange}
          theme="snow"
          modules={modules}
          formats={formats}
          value={editorHtml}
        />
        <button onClick={() =>handleDataSubmit()}>Submit</button>
      </>
    );
  };

export default CustomEditor;
