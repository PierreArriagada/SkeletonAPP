import { test, expect } from '@playwright/test';

test.describe('Pruebas de Autenticación y Perfil con Playwright', () => {

  async function preparePage(page: any) {
    await page.goto('/');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible({ timeout: 10000 });
  }

  test('Debe mostrar un error con credenciales incorrectas', async ({ page }) => {
    await preparePage(page);

    await page.locator('[data-testid="username-input"] input').fill('usuarioinvalido');
    await page.locator('[data-testid="password-input"] input').fill('0000');
    await page.locator('[data-testid="login-button"]').click();
    
    const errorElement = page.locator('[data-testid="error-message"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('incorrecto');
  });

  test('Debe permitir el login y mostrar la página de Mis Datos', async ({ page }) => {
    await preparePage(page);

    await page.locator('[data-testid="username-input"] input').fill('pierre');
    await page.locator('[data-testid="password-input"] input').fill('1234');
    await page.locator('[data-testid="login-button"]').click();

    // Buscamos el botón de GUARDAR en la página de "Mis Datos"
    const saveButton = page.getByTestId('guardar-datos-button');
    
    // Verificamos que el botón sea visible para confirmar que la página cargó correctamente.
    await expect(saveButton).toBeVisible({ timeout: 10000 });
   

    await expect(page).toHaveURL(/.*home\/mis-datos/);
  });
});