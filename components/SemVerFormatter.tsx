import { SemVer, semVerToString } from '../src/semVer';
import QuestionMark from '@mui/icons-material/QuestionMark';
import { Tooltip } from '@mui/material';

type SemVerProps = {
  semver: SemVer;
};

export function SemVerFormatter(props: SemVerProps) {
  const formatted = semVerToString(props.semver);
  return (
    <>
      {formatted}
      {(formatted === '0.0.0-development' || formatted === '0.0.0') && (
        <Tooltip
          arrow
          title={
            <p
              style={{
                fontSize: 'var(--font-size-normal)',
                fontFamily: 'var(--primary-font-family)',
              }}
            >
              This repository was defined with a default version of 0.0.0
            </p>
          }
        >
          <QuestionMark sx={{ width: '1.125rem', height: '1.125rem' }} />
        </Tooltip>
      )}
    </>
  );
}
