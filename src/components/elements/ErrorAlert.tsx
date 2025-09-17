import { Alert } from '..';

type Props = {
  message: string;
  title?: string;
};

export default function ErrorAlert({ message, title = 'Something went wrong' }: Props) {
  return (
    <Alert tone="error" title={title}>
      {message}
    </Alert>
  );
}
