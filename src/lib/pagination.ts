export function normalizePagination(page = 1, pageSize = 20) {
  return {
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: Number.isSafeInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 20,
  }
}
