using Library_Management_System.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Library_Management_System.Repository
{
    public class LibraryRepository<T> : ILibraryRepository<T> where T : class
    {
        private readonly BookDbContext _dbContext;
        private readonly DbSet<T> _dbSet;

        public LibraryRepository(BookDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
        }

       
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

    
        public async Task<T?> GetByIdAsync(
            Expression<Func<T, bool>> filter,
            bool useNoTracking = false,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            if (useNoTracking)
                query = query.AsNoTracking();

            foreach (var include in includes)
                query = query.Include(include);

            return await query.FirstOrDefaultAsync(filter);
        }


        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

      
        public async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        
        public async Task<bool> DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
