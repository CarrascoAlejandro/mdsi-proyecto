import { Boundary } from './boundary';

export default function InputErrorList(errors: string[]) {
  console.log(errors);
  const formatErrorMessages = errors.map((e: string) => {
    return <p className="text-sm">{e}</p>;
  });

  return (
    <div className="m-3">
      <Boundary labels={['Error']} color="pink">
        <div className="space-y-4">
          <div className="prose-lg font-bold ">Error in the input:</div>
          {formatErrorMessages}
        </div>
      </Boundary>
    </div>
  );
}
