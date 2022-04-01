import { concatMemoName } from './helpers'

function _removeDuplicates(memoMenuItems) {
  return memoMenuItems.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
}

function _organizeMenuItems(memoDatas, activeFn) {
  const formattedMenuMemoItems = memoDatas.map(m => {
    const { courseCode, outdated, memoEndPoint: id } = m
    const label = concatMemoName(m.semester, m.ladokRoundIds, m.memoCommonLangAbbr)
    return {
      id,
      semester: m.semester,
      label,
      active: activeFn(),
      url: `/kurs-pm/${courseCode}/${id}`,
      outdated,
    }
  })
  // Duplicate id’s filtered out
  const menuMemoItemsWithoutDuplicates = _removeDuplicates(formattedMenuMemoItems)

  return menuMemoItemsWithoutDuplicates
}

function menuItemsForAboutMemo(memoDatas) {
  const noActiveFn = () => false

  return _organizeMenuItems(memoDatas, noActiveFn)
}

function menuItemsForCurrentMemo(memoDatas, currentMemoEndPoint) {
  const activeFn = id => id === currentMemoEndPoint

  return _organizeMenuItems(memoDatas, activeFn)
}

export { menuItemsForAboutMemo, menuItemsForCurrentMemo }
