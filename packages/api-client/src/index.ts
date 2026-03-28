export function createApiClient(baseUrl: string) {
  return {
    baseUrl,
    // Methods will be added as features are built
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
