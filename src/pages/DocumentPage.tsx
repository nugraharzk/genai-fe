import FilePanel from '../components/elements/FilePanel';
import { generateFromDocumentApi } from '../api';

const ACCEPT_TYPES =
  '.pdf,.doc,.docx,.txt,.md,.rtf,.html,.htm,.ppt,.pptx,.xls,.xlsx,application/*,text/*';

export default function DocumentPage() {
  return (
    <FilePanel
      mode="document"
      accept={ACCEPT_TYPES}
      helper="Max 20MB"
      submit={generateFromDocumentApi}
    />
  );
}
