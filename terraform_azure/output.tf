# defines what values to output once the infrustruture is deployed

output "web_app_default_hostname" {
  description = "Web application default hostname"
  value       = azurerm_linux_web_app.this.default_hostname
}
