using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ReactApp.DbModels
{
    public partial class DatabaseContext : DbContext
    {
        public DatabaseContext()
        {
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Activity> Activities { get; set; } = null!;

        public virtual DbSet<BoredActivity> BoredActivities { get; set; } = null!;
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; } = null!;
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; } = null!;
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; } = null!;
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; } = null!;
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; } = null!;
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; } = null!;
        public virtual DbSet<DeviceCode> DeviceCodes { get; set; } = null!;
        public virtual DbSet<Key> Keys { get; set; } = null!;
        public virtual DbSet<Note> Notes { get; set; } = null!;
        public virtual DbSet<PersistedGrant> PersistedGrants { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasKey(e => e.Key)
                    .HasName("PK__Activiti__C41E0288FE6EA154");

                entity.Property(e => e.Key).HasMaxLength(50);

                entity.Property(e => e.Accessibility).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("Name");

                entity.Property(e => e.Link).HasMaxLength(100);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Type).HasMaxLength(50);

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Activitie__UserI__4CA06362");
            });

            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);

                entity.HasMany(d => d.Roles)
                    .WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "AspNetUserRole",
                        l => l.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                        r => r.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                        j =>
                        {
                            j.HasKey("UserId", "RoleId");

                            j.ToTable("AspNetUserRoles");

                            j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                        });
            });

            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.Name).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<BoredActivity>(entity =>
            {
                entity.HasKey(e => e.Key)
                    .HasName("PK__Activiti__C41E0288FE6EA154");

                entity.Property(e => e.Key).HasMaxLength(50);

                entity.Property(e => e.Accessibility).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("Name");

                entity.Property(e => e.Link).HasMaxLength(100);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Type).HasMaxLength(50);

            });

            modelBuilder.Entity<DeviceCode>(entity =>
            {
                entity.HasKey(e => e.UserCode);

                entity.HasIndex(e => e.DeviceCode1, "IX_DeviceCodes_DeviceCode")
                    .IsUnique();

                entity.HasIndex(e => e.Expiration, "IX_DeviceCodes_Expiration");

                entity.Property(e => e.UserCode).HasMaxLength(200);

                entity.Property(e => e.ClientId).HasMaxLength(200);

                entity.Property(e => e.Description).HasMaxLength(200);

                entity.Property(e => e.DeviceCode1)
                    .HasMaxLength(200)
                    .HasColumnName("DeviceCode");

                entity.Property(e => e.SessionId).HasMaxLength(100);

                entity.Property(e => e.SubjectId).HasMaxLength(200);
            });

            modelBuilder.Entity<Key>(entity =>
            {
                entity.HasIndex(e => e.Use, "IX_Keys_Use");

                entity.Property(e => e.Algorithm).HasMaxLength(100);

                entity.Property(e => e.IsX509certificate).HasColumnName("IsX509Certificate");
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.Property(e => e.CreateTimestamp).HasDefaultValueSql("(sysutcdatetime())");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.Title).HasMaxLength(50);

                entity.Property(e => e.UpdateTimestamp).HasDefaultValueSql("(sysutcdatetime())");

                entity.Property(e => e.UserId).HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Notes)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Notes__UserId__412EB0B6");
            });

            modelBuilder.Entity<PersistedGrant>(entity =>
            {
                entity.HasKey(e => e.Key);

                entity.HasIndex(e => e.ConsumedTime, "IX_PersistedGrants_ConsumedTime");

                entity.HasIndex(e => e.Expiration, "IX_PersistedGrants_Expiration");

                entity.HasIndex(e => new { e.SubjectId, e.ClientId, e.Type }, "IX_PersistedGrants_SubjectId_ClientId_Type");

                entity.HasIndex(e => new { e.SubjectId, e.SessionId, e.Type }, "IX_PersistedGrants_SubjectId_SessionId_Type");

                entity.Property(e => e.Key).HasMaxLength(200);

                entity.Property(e => e.ClientId).HasMaxLength(200);

                entity.Property(e => e.Description).HasMaxLength(200);

                entity.Property(e => e.SessionId).HasMaxLength(100);

                entity.Property(e => e.SubjectId).HasMaxLength(200);

                entity.Property(e => e.Type).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
