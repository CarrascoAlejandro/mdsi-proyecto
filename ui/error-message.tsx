import { Boundary } from './boundary';

export default function ErrorMessage(message: string) {
  return (
    <div className="m-3">
      <Boundary labels={['Error']} color="orange">
        <div className="space-y-4 text-vercel-orange">
          <div className="prose prose-lg font-bold">Error</div>
          <p className="text-sm">{message}</p>
        </div>
      </Boundary>
    </div>
  );
}
