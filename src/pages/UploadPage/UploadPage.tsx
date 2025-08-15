import { Section, Cell, List, Button, Text } from '@telegram-apps/telegram-ui';
import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';

import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import { uploadTxtFile, uploadXmlFile, type UploadResponse } from '@/services/uploadService';

import './UploadPage.css';

const [, e] = bem('upload-page');

export const UploadPage: FC = () => {
    const [, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleUploadTxt = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);
            setUploadError(null);
            setUploadResult(null);

            const form = new FormData();
            form.append('file', file);

            const response = await uploadTxtFile(form);
            setUploadResult(response);

            // Clear file input
            event.target.value = '';

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi upload txt';
            setUploadError(errorMessage);
            console.error('Error uploading txt:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleUploadXml = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setUploading(true);
            setUploadError(null);
            setUploadResult(null);

            const form = new FormData();
            form.append('file', file);

            const response = await uploadXmlFile(form);
            setUploadResult(response);

            // Clear file input
            event.target.value = '';

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi upload xml';
            setUploadError(errorMessage);
            console.error('Error uploading xml:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Page>
            <List>
                <Section header="Upload Files">
                    <Cell className={e('upload-section')}>
                        <div className={e('upload-content')}>
                            <Text className={e('upload-title')}>Upload .txt</Text>
                            <div className={e('upload-btn-wrapper')}>
                                <Button
                                    mode="outline"
                                    size="m"
                                    // disabled={uploading}
                                    disabled
                                    className={e('upload-btn')}
                                    onClick={() => document.getElementById('txt-file-input')?.click()}
                                >
                                    Chọn file TXT
                                </Button>
                                <input
                                    id="txt-file-input"
                                    type="file"
                                    accept=".txt"
                                    hidden
                                    onChange={handleUploadTxt}
                                    // disabled={uploading}
                                    disabled
                                />
                            </div>
                        </div>
                    </Cell>

                    <Cell className={e('upload-section')}>
                        <div className={e('upload-content')}>
                            <Text className={e('upload-title')}>Upload .xml</Text>
                            <div className={e('upload-btn-wrapper')}>
                                <Button
                                    mode="outline"
                                    size="m"
                                    // disabled={uploading}
                                    disabled
                                    className={e('upload-btn')}
                                    onClick={() => document.getElementById('xml-file-input')?.click()}
                                >
                                    Chọn file XML
                                </Button>
                                <input
                                    id="xml-file-input"
                                    type="file"
                                    accept=".xml"
                                    hidden
                                    onChange={handleUploadXml}
                                    //disabled={uploading}
                                    disabled
                                />
                            </div>
                        </div>
                    </Cell>
                </Section>

                {/* Display upload results */}
                {uploadResult && (
                    <Section header="Kết quả upload">
                        <Cell className={e('result-section')}>
                            <div className={e('result-content')}>
                                <Text className={e('result-message')}>
                                    {uploadResult.message || 'Upload thành công!'}
                                </Text>
                                {uploadResult.import_result && (
                                    <Text className={e('import-result')}>
                                        Kết quả import: {JSON.stringify(uploadResult.import_result)}
                                    </Text>
                                )}
                            </div>
                        </Cell>
                    </Section>
                )}

                {/* Display upload errors */}
                {uploadError && (
                    <Section header="Lỗi upload">
                        <Cell className={e('error-section')}>
                            <div className={e('error-content')}>
                                <Text className={e('error-message')}>
                                    {uploadError}
                                </Text>
                            </div>
                        </Cell>
                    </Section>
                )}
            </List>
        </Page>
    );
};
