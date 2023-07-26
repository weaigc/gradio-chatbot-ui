import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BiExport, BiImport, BiListPlus } from 'react-icons/bi'
import Button from '~app/components/Button'
import Select from '~app/components/Select'
import EnabledBotsSettings from '~app/components/Settings/EnabledBotsSettings'
import { ALL_IN_ONE_PAGE_ID, DEFAULT_CHATBOTS } from '~app/consts'
import { exportData, importData } from '~app/utils/export'
import {
  UserConfig,
  getUserConfig,
  updateUserConfig,
} from '~services/user-config'
import { getVersion } from '~utils'
import PagePanel from '../components/Page'

function SettingPage() {
  const { t } = useTranslation()
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    getUserConfig().then((config) => setUserConfig(config))
  }, [])

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update })
      setDirty(true)
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    await updateUserConfig({ ...userConfig! })
    toast.success('Saved')
    setTimeout(() => location.reload(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title={`${t('Settings')} (v${getVersion()})`} footer={
      <Button color={dirty ? 'primary' : 'flat'} text={t('Save')} className="w-fit my-8" onClick={save} />
    }>
      <div className="flex flex-col gap-5 mt-3">
        <div>
          <p className="font-bold mb-1 text-lg">{t('Export/Import All Data')}</p>
          <p className="mb-3 opacity-80">{t('Data includes all your settings, chat histories, and local prompts')}</p>
          <div className="flex flex-row gap-3">
            <Button size="small" text={t('Export')} icon={<BiExport />} onClick={exportData} />
            <Button size="small" text={t('Import')} icon={<BiImport />} onClick={importData} />
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-lg">{t('Startup page')}</p>
          <div className="w-[200px]">
            <Select
              options={[
                { name: 'All-In-One', value: ALL_IN_ONE_PAGE_ID },
                ...DEFAULT_CHATBOTS.map((bot) => ({ name: bot.name, value: bot.url })),
              ]}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: v })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg flex items-center gap-2">
              {t('Chatbots')}
              {/* <Button text={t('Add More')} icon={<BiListPlus />} size="small" /> */}
            </p>
          <EnabledBotsSettings userConfig={userConfig} updateConfigValue={updateConfigValue} />
        </div>
      </div>
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
