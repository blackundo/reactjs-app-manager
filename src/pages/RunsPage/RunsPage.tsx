import { Section, Cell, List, Button, Text } from '@telegram-apps/telegram-ui';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './RunsPage.css';

const [, e] = bem('runs-page');

interface Run {
    id: number;
    run_type: string;
    created_at: string;
}

interface RunResult {
    id: number;
    uid: string;
    status: string;
    info: string;
}

export const RunsPage: FC = () => {
    const [runs] = useState<Run[]>([]);
    const [selectedRun] = useState<number | null>(null);
    const [runResults] = useState<RunResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshRuns();
    }, []);

    const refreshRuns = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call
            // const response = await getRuns();
            // setRuns(response.data.data || []);
        } catch (err) {
            console.error('Error refreshing runs:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRunResults = async (_rid: number) => {
        try {
            // TODO: Implement API call
            // const response = await getRunResults(rid);
            // setSelectedRun(rid);
            // setRunResults(response.data.data || []);
        } catch (err) {
            console.error('Error loading run results:', err);
        }
    };

    return (
        <Page>
            <List>
                <Section header="Run History">
                    <Cell className={e('refresh-section')}>
                        <Button
                            mode="outline"
                            size="m"
                            onClick={refreshRuns}
                            disabled={loading}
                            className={e('refresh-btn')}
                        >
                            {loading ? 'Loading...' : 'Refresh Runs'}
                        </Button>
                    </Cell>

                    {selectedRun && (
                        <Cell className={e('selected-run')}>
                            <Text className={e('selected-run-text')}>
                                Run #{selectedRun} — results: {runResults.length}
                            </Text>
                        </Cell>
                    )}

                    {runs.length > 0 ? (
                        runs.map((run) => (
                            <Cell key={run.id} className={e('run-item')}>
                                <div className={e('run-content')}>
                                    <div className={e('run-info')}>
                                        <Text className={e('run-id')}>ID: {run.id}</Text>
                                        <Text className={e('run-type')}>Type: {run.run_type}</Text>
                                        <Text className={e('run-created')}>Created: {run.created_at}</Text>
                                    </div>
                                    <Button
                                        mode="outline"
                                        size="s"
                                        onClick={() => loadRunResults(run.id)}
                                        className={e('view-btn')}
                                    >
                                        View
                                    </Button>
                                </div>
                            </Cell>
                        ))
                    ) : (
                        <Cell className={e('no-runs')}>
                            <Text>Không có runs nào</Text>
                        </Cell>
                    )}
                </Section>

                {runResults.length > 0 && (
                    <Section header="Run Results">
                        {runResults.map((result) => (
                            <Cell key={result.id} className={e('result-item')}>
                                <div className={e('result-content')}>
                                    <div className={e('result-info')}>
                                        <Text className={e('result-uid')}>UID: {result.uid}</Text>
                                        <Text className={e('result-status')}>Status: {result.status}</Text>
                                        <Text className={e('result-info-text')} title={result.info}>
                                            Info: {result.info.length > 50 ? result.info.substring(0, 50) + '...' : result.info}
                                        </Text>
                                    </div>
                                </div>
                            </Cell>
                        ))}
                    </Section>
                )}
            </List>
        </Page>
    );
};
