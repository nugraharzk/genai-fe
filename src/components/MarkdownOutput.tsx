import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  content?: string | null;
};

export default function MarkdownOutput({ content }: Props) {
  if (!content) {
    return <div className="output text-gray-500">(no text)</div>;
  }
  return (
    <div className="output markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline hover:text-brand-700"
            />
          ),
          code: ({ node, className, children, ...props }) => {
            // @ts-ignore: 'inline' is not typed but present on node
            const isInline = node && (node.inline as boolean);
            if (isInline) {
              return (
                <code
                  className="px-1 py-0.5 rounded bg-gray-100 border border-gray-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

