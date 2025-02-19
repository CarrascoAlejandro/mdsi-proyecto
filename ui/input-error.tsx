import { Boundary } from './boundary';

export default function InputErrorList(errors: string[]) {
  const formatErrorMessages = errors.map((e: string) => {
    return <p className="text-sm">{e}</p>;
  });

  return (
    <div className="m-3">
      <Boundary labels={['Error']} color="orange">
        <div className="space-y-4 text-vercel-orange">
          <div className="prose prose-lg font-bold">Error in the input:</div>
          {formatErrorMessages}
        </div>
      </Boundary>
    </div>
  );
}
