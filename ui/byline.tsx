import { VercelLogo } from '#/ui/vercel-logo';

export default function Byline() {
  return (
    <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
      <div className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">
        <div className="flex items-center gap-x-1.5">
          <div className="text-sm text-gray-400">By</div>
          <a href="https://vercel.com" title="Vercel">
            <div className="w-16 text-gray-100 hover:text-gray-50">
              <VercelLogo />
            </div>
          </a>
        </div>

        <div className="text-sm text-gray-400">
          <a
            className="underline decoration-dotted underline-offset-4 transition-colors hover:text-gray-300"
            href="https://github.com/CarrascoAlejandro/mdsi-proyecto"
            target="_blank"
            rel="noreferrer"
          >
            Ver código
          </a>
          {' desarrollado por '}
          <a
            className="underline decoration-dotted underline-offset-4 transition-colors hover:text-gray-300"
            href="https://github.com/CarrascoAlejandro"
            target="_blank"
            rel="noreferrer"
          >
            Alejandro Carrasco
          </a>
        </div>
      </div>
    </div>
  );
}
