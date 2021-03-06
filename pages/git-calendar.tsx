import React, { useEffect, useState } from 'react';
import { getContributions, GitContributes } from 'services/github-api';
import { CalendarLayout, CommitDay } from 'components/git-calendar';

type Props = {
  gitContributions: GitContributes[];
  darkMode: boolean;
  week: number;
};

const GitCalendar = (props: Props) => {
  const { gitContributions, darkMode, week } = props;
  const [gridSize, setGridSize] = useState<number | undefined>();

  useEffect(() => {
    const height = Math.floor(window.outerHeight / 7);
    const width = Math.floor(window.outerWidth / week) - 2;
    setGridSize((height < width ? height : width));
  }, [gitContributions.length, week]);

  return (
    <CalendarLayout darkMode={darkMode}>
      <div style={{ display: 'flex' }}>
        {gitContributions.map(({ contributionDays, firstDay }) => (
          <div key={firstDay} style={{ display: 'flex', flexDirection: 'column' }}>
            {contributionDays.map((contribution) => (
              <CommitDay
                key={contribution.date}
                color={contribution.color}
                darkMode={darkMode}
                count={contribution.contributionCount}
                gridSize={gridSize}
              />
            ))}
          </div>
        ))}
      </div>
    </CalendarLayout>
  );
};

GitCalendar.getInitialProps = async (ctx: {
  query: {
    user: string,
    darkMode: string,
    week: number,
  }
}) => {
  const { query } = ctx;
  const week = query?.week || 8;

  try {
    const weeklyContributions = await getContributions(query?.user);
    const gitContributions = weeklyContributions.slice(-week);

    return { gitContributions, darkMode: query?.darkMode !== undefined, week };
  } catch (err) {
    console.log(err);
    return { gitContributions: [] };
  }
};

export default GitCalendar;
