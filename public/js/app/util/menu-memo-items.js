import { concatMemoName } from './helpers'

function _removeDuplicates(memoMenuItems) {
  return memoMenuItems.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
}

function _organizeMenuItems(memoDatas, activeFn) {
  if (!memoDatas || memoDatas.length === 0) return []
  const formattedMenuMemoItems = memoDatas.map(m => {
    const { courseCode, outdated, memoEndPoint, semester } = m
    const label = concatMemoName(semester, m.ladokRoundIds, m.memoCommonLangAbbr)
    return {
      id: memoEndPoint,
      semester,
      label,
      active: activeFn(memoEndPoint),
      url: `/kurs-pm/${courseCode}/${memoEndPoint}`,
      outdated,
    }
  })
  // Duplicate id’s filtered out
  const menuMemoItemsWithoutDuplicates = _removeDuplicates(formattedMenuMemoItems)

  return menuMemoItemsWithoutDuplicates
}

function menuItemsForAboutMemo(memoDatas) {
  const noActiveFn = id => false

  return _organizeMenuItems(memoDatas, noActiveFn)
}

function menuItemsForCurrentMemo(memoDatas, currentMemoEndPoint) {
  const activeFn = id => id === currentMemoEndPoint

  return _organizeMenuItems(memoDatas, activeFn)
}

export { menuItemsForAboutMemo, menuItemsForCurrentMemo }
