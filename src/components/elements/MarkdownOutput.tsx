import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { ComponentPropsWithoutRef } from 'react';

type Props = {
  content?: string | null;
};

type CodeComponentProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

const markdownComponents: Components = {
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-600 underline decoration-transparent underline-offset-4 transition hover:decoration-brand-400"
    />
  ),
  code: ({ inline, className, children, ...props }: CodeComponentProps) => {
    if (inline) {
      return (
        <code
          className="rounded-md border border-slate-200 bg-slate-100/80 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="my-3 overflow-x-auto rounded-2xl border border-slate-900/10 bg-slate-950 p-4 text-slate-100 shadow-inner">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
};

export default function MarkdownOutput({ content }: Props) {
  if (!content) {
    return <div className="text-sm text-slate-500">(no text)</div>;
  }
  return (
    <article className="prose prose-slate max-w-none text-sm prose-headings:mt-4 prose-headings:font-semibold prose-headings:text-slate-900 prose-p:my-3 prose-strong:text-slate-900 prose-a:text-brand-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
