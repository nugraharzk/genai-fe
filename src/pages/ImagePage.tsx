import FilePanel from '../components/elements/FilePanel';
import { generateFromImageApi } from '../api';

export default function ImagePage() {
  return (
    <FilePanel
      mode="image"
      accept="image/*"
      helper="Max 15MB"
      submit={generateFromImageApi}
    />
  );
}
