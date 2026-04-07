import React from "react";

interface DocumentViewerProps {
    url: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url }) => {
    return (
        <div className="w-full h-full bg-black/10 rounded-xl overflow-hidden shadow-edge">
            <iframe
                src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title="Document Preview"
            />
        </div>
    );
};

export default DocumentViewer;
